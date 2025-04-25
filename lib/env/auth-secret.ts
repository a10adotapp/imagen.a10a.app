import "server-only";

import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().min(1),
});

export function authSecret(): string {
  return envSchema.parse(process.env).AUTH_SECRET;
}
