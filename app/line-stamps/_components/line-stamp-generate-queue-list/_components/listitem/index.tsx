"use client";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useLiffContext } from "@/contexts/liff-context";
import { format as formatDate } from "@formkit/tempo";
import { LineStampGenerateQueue, LineStampGenerateQueueMessage, LineStampImage } from "@prisma/client";
import { Download, Send } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";
import toast from "react-hot-toast";

export function Listitem({
  lineStampGenerateQueue,
}: {
  lineStampGenerateQueue: (
    LineStampGenerateQueue & {
      messages: (
        LineStampGenerateQueueMessage & {
          images: LineStampImage[];
        }
      )[];
    }
  )
}) {
  const { liff } = useLiffContext();

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-bold">
        {formatDate({
          date: lineStampGenerateQueue.createdAt,
          format: "YYYY/MM/DD HH:mm",
          tz: "Asia/Tokyo",
        })}
      </div>

      {lineStampGenerateQueue.consumedAt === null && (
        <div className="text-sm text-gray-400">
          生成中...
        </div>
      )}

      {lineStampGenerateQueue.consumedAt !== null && (
        <div className="grid grid-cols-3 gap-1">
          {lineStampGenerateQueue.messages.map((message) => (
            <Fragment
              key={`line-stamp-generate-queue-message-${message.id}`}>
              {message.images.map((image) => (
                <Drawer key={`line-stamp-image-${image.id}`}>
                  <DrawerTrigger asChild>
                    <Image
                      alt={message.message}
                      src={image.imageUri}
                      width={512}
                      height={512}
                      className="w-full h-full rounded" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle>{message.message}</DrawerTitle>
                    </DrawerHeader>

                    <div className="flex flex-col gap-4 p-4">
                      <Image
                        key={`line-stamp-image-${image.id}`}
                        alt={message.message}
                        src={image.imageUri}
                        width={512}
                        height={512}
                        className="w-full h-full rounded" />

                      <Button
                        type="button"
                        onClick={async () => {
                          try {
                            await liff?.shareTargetPicker([
                              {
                                type: "image",
                                originalContentUrl: image.imageUri,
                                previewImageUrl: image.imageUri,
                              },
                            ], {
                              isMultiple: true,
                            });

                            toast.success("ともだちにマイスタンプを送信しました！");
                          } catch (err) {
                            toast.error(JSON.stringify(err));
                          }
                        }}
                        className="bg-linear-to-r from-emerald-400 to-cyan-400">
                        <div className="flex items-center gap-2">
                          <Send size={12} />

                          <div className="font-bold">ともだちに送る</div>
                        </div>
                      </Button>
                    </div>
                  </DrawerContent>
                </Drawer>
              ))}
            </Fragment>
          ))}

          <Button
            type="button"
            variant="secondary"
            onClick={async () => {
              try {
                if (!confirm([
                  "トークルームにマイスタンプを送信しますか？",
                  "",
                  "-----",
                  "公式アカウントのトークルームに送信されるマイスタンプをタップすると、",
                  "ダウンロードボタンからマイスタンプをダウンロードすることができます。",
                ].join("\n"))) {
                  return;
                }

                await liff?.sendMessages(
                  lineStampGenerateQueue.messages
                    .flatMap((message) => message.images.flatMap((image) => ({
                      type: "image",
                      originalContentUrl: image.imageUri,
                      previewImageUrl: image.imageUri,
                    }))),
                );

                toast.success("トークルームにマイスタンプを送信しました！");
              } catch (err) {
                toast.error(JSON.stringify(err));
              }
            }}
            className="h-full w-full">
            <div className="flex flex-col items-center gap-2">
              <Download size={48} />

              <div className="text-xs font-bold">ダウンロード</div>
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
