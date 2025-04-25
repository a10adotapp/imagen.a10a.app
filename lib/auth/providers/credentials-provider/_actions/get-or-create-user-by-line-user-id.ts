import "server-only";

import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export async function getUserByLineUserId(lineUserId: string): Promise<User> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        deletedAt: null,
        lineUserId,
      },
    });

    if (user) {
      return user;
    }

    return await prisma.user.create({
      data: {
        lineUserId,
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
