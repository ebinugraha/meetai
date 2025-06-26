import { z } from "zod";

export const agentsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  instruction: z.string().min(1, { message: "Instruction is required" }),
});

export const updateAgentsSchema = agentsSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
});
