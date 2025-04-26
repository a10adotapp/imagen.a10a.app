"use server";

import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { OpenaiUsage } from "@prisma/client";
import { cache } from "react";

export async function listOpenaiUsage(): Promise<(
  OpenaiUsage
)[]> {
  try {
    return await prisma.openaiUsage.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  } catch (err) {
    logger.error({
      action: import.meta.filename,
      error: err,
    });

    throw err;
  }
}

export const listOpenaiUsageCached = cache(listOpenaiUsage);
