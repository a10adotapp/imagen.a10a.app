"use server";

import { auth } from "@/lib/auth";
import { publicDirname } from "@/lib/env/public-dirname";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";
import exifReader from "exif-reader";
import sharp from "sharp";

export async function createLineStampGenerateQueue({
  imageData,
  messages,
}: {
  imageData: string;
  messages: string[];
}): Promise<number> {
  const session = await auth();

  const now = new Date();

  try {
    if (!session) {
      throw new Error("no session");
    }

    const lineStampTicket = await prisma.lineStampTicket.findFirstOrThrow({
      where: {
        deletedAt: null,
        userId: session.user.id,
      },
    });

    const imageType = imageData.replace(/^data:([^;]+);.+$/, "$1");
    const imageContent = imageData.replace(/^[^;]+;base64,/, "");

    let s = sharp(Buffer.from(imageContent, "base64"));

    const { exif: exifBuffer, width, height, format } = await s.metadata();
    const exif = exifBuffer ? exifReader(exifBuffer) : null;

    if (width && height) {
      if (width > 1024 || height > 1024) {
        s = s.resize({
          ...(width >= height ? {
            width: 1024,
          } : {}),
          ...(height >= width ? {
            height: 1024,
          } : {}),
        });
      }
    }

    const filePath = `${publicDirname()}/images/line-stamps/base/${createId()}.${format}`;

    await s.toFile(filePath);

    const lineStampGenerateQueue = await prisma.lineStampGenerateQueue.create({
      data: {
        userId: session.user.id,
        imageUri: filePath,
        imageType,
        imageExif: exif || undefined,
      }
    });

    await prisma.lineStampGenerateQueueMessage.createMany({
      data: messages.map((message, i) => ({
        userId: session.user.id,
        lineStampGenerateQueueId: lineStampGenerateQueue.id,
        message,
        orderPriority: i + 1,
      })),
    });

    await prisma.lineStampTicketConsumption.create({
      data: {
        userId: session.user.id,
        lineStampTicketId: lineStampTicket.id,
        lineStampGenerateQueueId: lineStampGenerateQueue.id,
      },
    });

    await prisma.lineStampTicket.update({
      where: {
        id: lineStampTicket.id,
      },
      data: {
        deletedAt: now,
        updatedAt: now,
      },
    });

    return await prisma.lineStampGenerateQueue.count({
      where: {
        deletedAt: null,
        consumedAt: null,
        createdAt: {
          lte: lineStampGenerateQueue.createdAt,
        },
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
