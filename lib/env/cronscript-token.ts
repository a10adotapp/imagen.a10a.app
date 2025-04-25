import "server-only";

import { z } from "zod";

const envSchema = z.object({
  CRONSCRIPT_TOKEN: z.string().min(1),
});

export function cronscriptToken(): string {
  return envSchema.parse(process.env).CRONSCRIPT_TOKEN;
}
