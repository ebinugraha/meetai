import { db } from "@/db";
import { meetings } from "@/db/schema";
import { createTRPCRouter, protectedBaseProcedure } from "@/trpc/init";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constant";
import { sleep, TRPCError } from "@trpc/server/unstable-core-do-not-import";
import { meetingsSchema, updateMeetingsSchema } from "../schemas";
import { agents } from "../../../db/schema";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream-video";
import { generateAvatar } from "@/lib/avatar";

export const meetingsRouter = createTRPCRouter({
  generateToken: protectedBaseProcedure.mutation(async ({ ctx }) => {
    await streamVideo.upsertUsers([
      {
        id: ctx.auth.user.id,
        name: ctx.auth.user.name,
        role: "admin",
        image:
          ctx.auth.user.image ??
          generateAvatar({
            seed: ctx.auth.user.name,
            variant: "initials",
          }),
      },
    ]);

    // membuat waktu expires
    const expirationTime = Math.floor(Date.now() / 1000 + 3600);
    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamVideo.generateUserToken({
      user_id: ctx.auth.user.id,
      exp: expirationTime,
      validity_in_seconds: issuedAt,
    });

    return token;
  }),
  remove: protectedBaseProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [removeData] = await db
        .delete(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        )
        .returning();

      if (!removeData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Meetings not found",
        });
      }
      return removeData;
    }),

  update: protectedBaseProcedure
    .input(updateMeetingsSchema)
    .mutation(async ({ input, ctx }) => {
      const [dataUpdate] = await db
        .update(meetings)
        .set(input)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        )
        .returning();

      if (!dataUpdate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agents not found",
        });
      }
      return dataUpdate;
    }),
  getOne: protectedBaseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [data] = await db
        .select({
          ...getTableColumns(meetings),
          agents: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration"
          ),
        })
        .from(meetings)
        .where(
          and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id))
        )
        .innerJoin(agents, eq(meetings.agentId, agents.id));

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agents not found",
        });
      }

      return data;
    }),

  getMany: protectedBaseProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.Upcoming,
            MeetingStatus.Active,
            MeetingStatus.Completed,
            MeetingStatus.Processing,
            MeetingStatus.Cancelled,
          ])
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const actualInput = input || {};
      const { page, pageSize, search, agentId, status } = {
        page: actualInput.page ?? DEFAULT_PAGE,
        pageSize: actualInput.pageSize ?? DEFAULT_PAGE_SIZE,
        search: actualInput.search,
        agentId: actualInput.agentId,
        status: actualInput.status,
      };

      const data = await db
        .select({
          ...getTableColumns(meetings),
          // inner join
          agent: agents,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            "duration"
          ),
        })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            input?.search ? ilike(meetings.name, `%${search}%`) : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .innerJoin(agents, eq(meetings.agentId, agents.id))
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            input?.search
              ? ilike(meetings.name, `%${input.search}%`)
              : undefined,
            status ? eq(meetings.status, status) : undefined,
            agentId ? eq(meetings.agentId, agentId) : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),

  create: protectedBaseProcedure
    .input(meetingsSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdMeeting] = await db
        .insert(meetings)
        .values({ ...input, userId: ctx.auth.user.id })
        .returning();

      const call = streamVideo.video.call("default", createdMeeting.id);
      await call.create({
        data: {
          created_by_id: ctx.auth.user.id,
          custom: {
            meetingId: createdMeeting.id,
            meetingName: createdMeeting.name,
          },
          settings_override: {
            transcription: {
              language: "id",
              mode: "auto-on",
              closed_caption_mode: "auto-on",
            },
            recording: {
              mode: "auto-on",
              quality: "1080p",
            },
          },
        },
      });

      const [existingAgents] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, createdMeeting.agentId));

      if (!existingAgents) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Agent not found",
        });
      }

      await streamVideo.upsertUsers([
        {
          id: existingAgents.id,
          name: existingAgents.name,
          role: "user",
          image: generateAvatar({
            seed: existingAgents.name,
            variant: "botttsNeutral",
          }),
        },
      ]);

      return createdMeeting;
    }),
});
