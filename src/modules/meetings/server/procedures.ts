import { db } from "@/db";
import { meetings } from "@/db/schema";
import { createTRPCRouter, protectedBaseProcedure } from "@/trpc/init";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/constant";
import { sleep, TRPCError } from "@trpc/server/unstable-core-do-not-import";

export const meetingsRouter = createTRPCRouter({
  getOne: protectedBaseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const [data] = await db
        .select({
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(
            eq(meetings.id, meetings.id),
            eq(meetings.userId, ctx.auth.user.id)
          )
        );

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
      })
    )
    .query(async ({ ctx, input }) => {
      const actualInput = input || {};
      const { page, pageSize, search } = {
        page: actualInput.page ?? DEFAULT_PAGE,
        pageSize: actualInput.pageSize ?? DEFAULT_PAGE_SIZE,
        search: actualInput.search,
      };

      const data = await db
        .select({
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            input?.search
              ? ilike(meetings.name, `%${input.search}%`)
              : undefined
          )
        )
        .orderBy(desc(meetings.createdAt), desc(meetings.name))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.user.id),
            input?.search
              ? ilike(meetings.name, `%${input.search}%`)
              : undefined
          )
        );

      const totalPages = Math.ceil(total.count / pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),
});
