import { z } from 'zod';

export const urlSchema = z.object({
  originalUrl: z.string().url({ message: 'Invalid URL format' }),
  customCode: z.string().min(3).max(20).optional()
});


