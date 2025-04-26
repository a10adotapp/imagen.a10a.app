import { z } from "zod";

export const usageSchema = z.object({
  input_tokens: z.number().default(0),
  input_tokens_details: z.object({
    image_tokens: z.number().default(0),
    text_tokens: z.number().default(0),
  }),
  output_tokens: z.number().default(0),
  total_tokens: z.number().default(0),
});
