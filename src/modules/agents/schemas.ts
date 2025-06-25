import { z } from "zod";

export const agentsSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    instruction: z.string().min(1, {message: "Instruction is required"})
})