"use server";

import { auth } from "@/lib/auth";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { LineStampGenerateQueue, LineStampGenerateQueueMessage, LineStampImage } from "@prisma/client";
import { cache } from "react";

export async function listLineStampGenerateQueue(): Promise<(
  LineStampGenerateQueue & {
    messages: (
      LineStampGenerateQueueMessage & {
        images: LineStampImage[];
      }
    )[];
  }
)[]> {
  const session = await auth();

  try {
    if (!session) {
      throw new Error("no session");
    }

    return await prisma.lineStampGenerateQueue.findMany({
      include: {
        messages: {
          include: {
            images: {
              where: {
                deletedAt: null,
              },
              orderBy: [
                {
                  id: "asc",
                },
              ],
            },
          },
          where: {
            deletedAt: null,
          },
          orderBy: [
            {
              orderPriority: "asc",
            }
          ],
        },
      },
      where: {
        deletedAt: null,
        userId: session.user.id,
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

export const listLineStampGenerateQueueCached = cache(listLineStampGenerateQueue);
