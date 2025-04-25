import "server-only";

import { z } from "zod";

const envSchema = z.object({
  PUBLIC_DIRNAME: z.string().min(1),
});

export function publicDirname(): string {
  return envSchema.parse(process.env).PUBLIC_DIRNAME;
}
