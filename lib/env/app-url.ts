import "server-only";

import { z } from "zod";

const envSchema = z.object({
  APP_URL: z.string().min(1),
});

export function appUrl(): string {
  return envSchema.parse(process.env).APP_URL;
}
