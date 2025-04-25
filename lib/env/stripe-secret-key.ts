import "server-only";

import { z } from "zod";

const envSchema = z.object({
  STRIPE_SECRET_KEY: z.string().min(1),
});

export function stripeSecretKey(): string {
  return envSchema.parse(process.env).STRIPE_SECRET_KEY;
}
