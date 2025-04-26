import { publicDirname } from "@/lib/env/public-dirname";
import logger from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { createId } from "@paralleldrive/cuid2";
import path from "node:path";
import OpenAI from "openai";
import sharp from "sharp";

const globalForConsumer = global as unknown as {
  lineStampGenerateQueueConsumer: LineStampGenerateQueueConsumer;
};

class LineStampGenerateQueueConsumer {
  hasStarted: boolean = false;

  lineStampGenerateQueueId: string | null = null;

  constructor() {
    this.start();
  }

  async check(): Promise<boolean> {
    return this.hasStarted;
  }

  async start(): Promise<void> {
    this.hasStarted = true;

    try {
      while (true) {
        const lineStampGenerateQueue = await prisma.lineStampGenerateQueue.findFirst({
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

        this.lineStampGenerateQueueId = lineStampGenerateQueue?.id || null;

        if (!lineStampGenerateQueue) {
          await new Promise<void>((resolve) => {
            setTimeout(() => {
              resolve();
            }, 10 * 1000);
          });

          continue;
        }

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
                  "売れるLINEスタンプを作りたいので、LINEスタンプ用の画像を作成してください。",
                  "",
                  "-----",
                  "# 手順",
                  "1. 人物や動物の抽出",
                  "  1-1. 画像に写っている人物や動物を抽出してください。",
                  "  1-2. 抽出した人物や動物の特徴を、LINEスタンプ風にデフォルメしたキャラクターを考えてください。",
                  "    1-2-1. 人物や動物は２頭身くらいとし、顔がはっきり見えるようにしてください。",
                  "    1-2-2. 人物や動物の特徴的な部分は強調し、デフォルメしすぎず、元の人物や動物が連想できるようにしてください。",
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
                  imageUri: `/assets/images/line-stamps/generated/${fileName}`,
                })),
              });

              await prisma.openaiUsage.create({
                data: {
                  usage: {
                    input_tokens: generateResult.usage?.input_tokens,
                    input_tokens_details: {
                      image_tokens: generateResult.usage?.input_tokens_details.image_tokens,
                      text_tokens: generateResult.usage?.input_tokens_details.text_tokens,
                    },
                    output_tokens: generateResult.usage?.output_tokens,
                    total_tokens: generateResult.usage?.total_tokens,
                  },
                  metadata: {
                    action: "openai.images.edit",
                    model: "gpt-image-1",
                    trigger: "lineStampGenerateQueue",
                    triggerKey: lineStampGenerateQueue.id,
                  },
                },
              });

              break;
            } catch (err) {
              logger.warn({
                action: "LineStampGenerateQueueConsumer.start",
                error: err,
                lineStampGenerateQueue: {
                  id: this.lineStampGenerateQueueId,
                },
              });
            }
          }
        }

        await prisma.lineStampGenerateQueue.update({
          where: {
            id: lineStampGenerateQueue.id,
          },
          data: {
            consumedAt: new Date(),
          },
        });
      }
    } catch (err) {
      logger.warn({
        action: "LineStampGenerateQueueConsumer.start",
        error: err,
        lineStampGenerateQueue: {
          id: this.lineStampGenerateQueueId,
        },
      });
    } finally {
      this.hasStarted = false;
    }
  }
}

export const lineStampGenerateQueueConsumer = globalForConsumer.lineStampGenerateQueueConsumer || new LineStampGenerateQueueConsumer();

globalForConsumer.lineStampGenerateQueueConsumer = lineStampGenerateQueueConsumer;
