import { z } from "zod";

export const urlSchema = z.object({
  originalUrl: z.string().url(),
  customCode: z
    .string()
    .trim()
    .min(5, "Custom code must be at least 5 characters")
    .optional()
    .or(z.literal("")), // allow empty string
});