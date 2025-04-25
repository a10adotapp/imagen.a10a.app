"use server";

import { auth } from "@/lib/auth";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export async function countLineStampTicket(): Promise<number> {
  const session = await auth();

  try {
    if (!session) {
      throw new Error("no session");
    }

    return await prisma.lineStampTicket.count({
      where: {
        deletedAt: null,
        userId: session.user.id,
      },
    });
  } catch (err) {
    logger.error({
      action: import.meta.filename,
      error: err,
    });

    throw err;
  }
}

export const countLineStampTicketCached = cache(countLineStampTicket);
