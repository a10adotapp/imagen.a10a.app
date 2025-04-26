import { z } from "zod";

export const metadataSchema = z.object({
  action: z.string(),
  model: z.string(),
  trigger: z.string(),
  triggerKey: z.string(),
});
