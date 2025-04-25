import { appUrl } from "@/lib/env/app-url";
import { cronscriptToken } from "@/lib/env/cronscript-token";
import { publicDirname } from "@/lib/env/public-dirname";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";
import path from "node:path";
import OpenAI from "openai";
import sharp from "sharp";

export async function POST(request: Request) {
  const token = cronscriptToken();

  if (token) {
    if (token !== request.headers.get("x-cronscript-token")) {
      return Response.json({
        error: "Invalid token",
      }, {
        status: 401,
      });
    }
  }

  const now = new Date();

  try {
    const lineStampGenerateQueues = await prisma.lineStampGenerateQueue.findMany({
      include: {
        messages: {
          where: {
            deletedAt: null,
          },
          orderBy: [
            {
              orderPriority: "asc",
            },
          ],
        },
      },
      where: {
        deletedAt: null,
        consumedAt: null,
      },
      orderBy: [
        {
          createdAt: "asc",
        },
      ],
      take: 10,
    });

    for (const lineStampGenerateQueue of lineStampGenerateQueues) {
      try {
        const openai = new OpenAI();

        const s = sharp(lineStampGenerateQueue.imageUri);

        const { format } = await s.metadata();

        for (const message of lineStampGenerateQueue.messages) {
          for (let safeLoopCount = 10; safeLoopCount > 0; safeLoopCount--) {
            try {
              const generateResult = await openai.images.edit({
                model: "gpt-image-1",
                image: new File([await s.toBuffer()], path.basename(lineStampGenerateQueue.imageUri), {
                  type: lineStampGenerateQueue.imageType,
                }),
                quality: "medium",
                size: "1024x1024",
                n: 1,
                prompt: [
                  "LINEスタンプ用の画像を作成してください。",
                  "",
                  "-----",
                  "# 手順",
                  "1. 人物や動物の抽出",
                  "  1-1. 画像に写っている人物や動物を抽出してください。",
                  "  1-2. 抽出した人物や動物の特徴を、LINEスタンプ風にデフォルメしたキャラクターを考えてください。",
                  "2. 背景の作成",
                  "  2-1. ポップでポジティブなイメージの背景を作成してください。",
                  "  2-2. {メッセージ}に合うようなイラストを、アクセントになるように背景に入れ込んでください。",
                  "3. キャラクターの合成",
                  "  3-1. 2で考えたキャラクターに、{メッセージ}に合うような表情やポーズをさせてください。",
                  "  3-1. 3で作成した背景の上に、キャラクターを合成してください。",
                  "4. メッセージの合成",
                  "  4-1. {メッセージ}を、読みやすいように配置してください。",
                  "5. 全体の調整",
                  "  5-1. 全体が明るく見えるように、色のバランスを調整してください。",
                  "  5-2. キャラクターや{メッセージ}が目立つように、縁取りをしてください。",
                  "",
                  "-----",
                  "# メッセージ",
                  "以下はLINEスタンプ用の画像として作成したいメッセージです。",
                  "{手順}に従って、メッセージの内容に合うようなLINEスタンプ用の画像を生成してください。",
                  `「${message.message}」`,
                ].join("\n"),
              });

              const fileNames = await Promise.all(
                (generateResult.data || []).map(async (image) => {
                  if (!image.b64_json) {
                    return null;
                  }

                  const fileName = `${createId()}.${format}`;

                  await sharp(Buffer.from(image.b64_json, "base64"))
                    .toFile(`${publicDirname()}/images/line-stamps/generated/${fileName}`);

                  return fileName;
                }),
              );

              await prisma.lineStampImage.createMany({
                data: fileNames.filter((fileName) => (fileName !== null)).map((fileName) => ({
                  userId: lineStampGenerateQueue.userId,
                  lineStampGenerateQueueId: lineStampGenerateQueue.id,
                  lineStampGenerateQueueMessageId: message.id,
                  imageUri: `${appUrl()}/images/line-stamps/generated/${fileName}`,
                })),
              });

              break;
            } catch (err) {
              logger.warn({
                action: "api.line-stamps.generate-queues.consume.POST",
                error: err,
              });
            }
          }
        }

        await prisma.lineStampGenerateQueue.update({
          where: {
            id: lineStampGenerateQueue.id,
          },
          data: {
            consumedAt: now,
          },
        });
      } catch (err) {
        logger.warn({
          action: "api.line-stamps.generate-queues.consume.POST",
          error: err,
          queue: {
            id: lineStampGenerateQueue.id,
          },
        });
      }
    }
  } catch (err) {
    logger.error({
      action: "api.line-stamps.generate-queues.consume.POST",
      error: err,
    });

    throw err;
  }

  return Response.json({ message: "ok" });
}
