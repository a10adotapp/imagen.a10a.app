import "server-only";

import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";

export async function getUser(id: string): Promise<User> {
  try {
    return await prisma.user.findFirstOrThrow({
      where: {
        deletedAt: null,
        id,
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
