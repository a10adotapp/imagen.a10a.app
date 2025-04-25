"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MD5 } from "crypto-js";
import { Image, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useCallback, useReducer, useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { createLineStampGenerateQueue } from "./_actions/create-line-stamp-generate-queue";

export function LineStampsCreateForm() {
  const router = useRouter();

  const [imageData, setImageData] = useState<string | null>(null);

  const [messages, setMessages] = useReducer((messages, { message, index }) => {
    messages[index] = message;

    return messages;
  }, [
    "おはよう",
    "おやすみ",
    "いいね！",
    "ありがとう！",
    "おめでとう！",
  ]);

  const [isBusy, setIsBusy] = useState(false);

  const submitButtonClickHandler = useCallback(async () => {
    if (!imageData) {
      alert("画像を選択してください");

      return;
    }

    if (!confirm("この写真からマイスタンプを作成しますか？")) {
      return;
    }

    try {
      setIsBusy(true);

      const queueCount = await toast.promise(createLineStampGenerateQueue({
        imageData,
        messages,
      }), {
        loading: "マイスタンプの作成をリクエストしています...",
        error: "マイスタンプの作成をリクエストできませんでした",
        success: "マイスタンプの作成をリクエストしました",
      });

      toast.success((
        <div className="flex flex-col">
          <div>
            現在<span className="font-bold">{queueCount}</span>人待ちです。
          </div>

          <div className="text-sm text-gray-400">
            （約{queueCount * 2}分後に生成されます）
          </div>
        </div>
      ));

      router.push("/line-stamps");

      router.refresh();
    } finally {
      setIsBusy(false);
    }
  }, [imageData, messages, router]);

  const imageFileFieldChangeHandler = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);

    if (!file) {
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = async () => {
      const data = z.string().parse(fileReader.result);

      setImageData(data);
    };

    fileReader.readAsDataURL(file);
  }, []);

  return (
    <div
      className="flex flex-col gap-4">
      <div
        className="flex flex-col gap-2">
        <div className="text-sm font-bold">スタンプにする写真</div>

        <label
          className="flex justify-center items-center w-full aspect-square rounded-lg"
          style={{
            backgroundColor: "oklch(96.7% 0.003 264.542)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            ...(imageData ? {
              backgroundImage: `url(${imageData})`,
            } : {}),
          }}>
          <Input
            type="file"
            multiple={false}
            accept="image/*"
            onChange={imageFileFieldChangeHandler}
            className="hidden" />
          {!imageData && (
            <div className="flex flex-col items-center gap-4">
              {// eslint-disable-next-line jsx-a11y/alt-text
              }<Image size={32} />

              <div className="text-sm font-bold">スタンプにする写真を選択してください</div>
            </div>
          )}
        </label>
      </div>

      <div
        className="flex flex-col gap-2">
        <div className="text-sm font-bold">メッセージ</div>

        {messages.map((message, i) => {
          const key = MD5(`${i}:${message}`).toString();

          return (
            <div key={key}>
              <Input
                defaultValue={message}
                onChange={(event) => {
                  setMessages({
                    index: i,
                    message: event.target.value,
                  });
                }} />
            </div>
          );
        })}
      </div>

      <hr />

      <Button
        onClick={submitButtonClickHandler}
        disabled={isBusy}
        className="bg-linear-to-r from-emerald-400 to-cyan-400">
        <div className="flex items-center gap-1">
          <Sparkles size={16} />

          <div className="font-bold">マイスタンプを作成する</div>
        </div>
      </Button>
    </div>
  );
}
