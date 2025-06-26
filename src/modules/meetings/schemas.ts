import { z } from "zod";

export const meetingsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  agentId: z.string().min(1, { message: "agent id is required" }),
});

export const updateMeetingsSchema = meetingsSchema.extend({
  id: z.string().min(1, { message: "Id is required" }),
});
