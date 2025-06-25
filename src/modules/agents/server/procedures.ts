import { db } from "@/db";
import { agents } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedBaseProcedure,
} from "@/trpc/init";
import { agentsSchema } from "../schemas";
import { z } from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
  getOne: protectedBaseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [data] = await db
        .select({
          ...getTableColumns(agents)
        })
        .from(agents)
        .where(eq(agents.id, input.id));
      return data;
    }),
  // next change to protectedBaseProcedure
  getMany: protectedBaseProcedure.query(async () => {
    const data = await db.select().from(agents);
    return data;
  }),
  create: protectedBaseProcedure
    .input(agentsSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({ ...input, userId: ctx.auth.user.id })
        .returning();

      return createdAgent;
    }),
});
