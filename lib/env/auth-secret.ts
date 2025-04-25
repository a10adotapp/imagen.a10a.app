import "server-only";

import { z } from "zod";

const envSchema = z.object({
  AUTH_SECRET: z.string().optional().transform((v) => v || undefined),
});

export function authSecret(): string | undefined {
  return envSchema.parse(process.env).AUTH_SECRET;
}
