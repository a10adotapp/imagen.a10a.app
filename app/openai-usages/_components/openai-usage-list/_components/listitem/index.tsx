"use client";

import { metadataSchema } from "@/lib/openai-usage/metadata-schema";
import { usageSchema } from "@/lib/openai-usage/usage-schema";
import { format } from "@formkit/tempo";
import { OpenaiUsage } from "@prisma/client";
import BigNumber from "bignumber.js";

export function Listitem({
  openaiUsage,
  jpyUsdRate,
}: {
  openaiUsage: OpenaiUsage;
  jpyUsdRate: number;
}) {
  const parsedUsgae = usageSchema.parse(openaiUsage.usage);
  const parsedMetadata = metadataSchema.parse(openaiUsage.metadata);

  const inputTextCost = BigNumber(parsedUsgae.input_tokens_details.text_tokens)
    .multipliedBy(BigNumber(5).dividedBy(BigNumber(1000000)));

  const inputImageCost = BigNumber(parsedUsgae.input_tokens_details.image_tokens)
    .multipliedBy(BigNumber(10).dividedBy(BigNumber(1000000)));

  const outputImageCost = BigNumber(parsedUsgae.output_tokens)
    .multipliedBy(BigNumber(40).dividedBy(BigNumber(1000000)));

  const totalCost = inputTextCost.plus(inputImageCost).plus(outputImageCost);

  return (
    <div
      key={`openai-usage-listitem-${openaiUsage.id}`}
      className="flex flex-col">
      <div className="flex items-center gap-2">
        <div className="text-sm text-blue-600 font-bold">
          {format({
            date: openaiUsage.createdAt,
            format: "YYYY/MM/DD HH:mm",
            tz: "Asia/Tokyo",
          })}
        </div>

        <div className="text-sm text-gray-400">
          {parsedMetadata.action}
        </div>

        <div className="text-sm text-gray-400">
          {parsedMetadata.model}
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col items-start">
          <div className="text-sm font-bold">
            total
          </div>

          <div>
            USD {totalCost.toFixed(4)}
          </div>

          <div>
            JPY {totalCost.multipliedBy(jpyUsdRate).toFixed(4)}
          </div>
        </div>

        <div className="flex flex-col items-start">
          <div className="text-sm text-gray-400 font-bold">
            input (text)
          </div>

          <div className="text-gray-400">
            USD {inputTextCost.toFixed(4)}
          </div>

          <div className="text-gray-400">
            JPY {inputTextCost.multipliedBy(jpyUsdRate).toFixed(4)}
          </div>
        </div>

        <div className="flex flex-col items-start">
          <div className="text-sm text-gray-400 font-bold">
            input (image)
          </div>

          <div className="text-gray-400">
            USD {inputImageCost.toFixed(4)}
          </div>

          <div className="text-gray-400">
            JPY {inputImageCost.multipliedBy(jpyUsdRate).toFixed(4)}
          </div>
        </div>

        <div className="flex flex-col items-start">
          <div className="text-sm text-gray-400 font-bold">
            output (image)
          </div>

          <div className="text-gray-400">
            USD {outputImageCost.toFixed(4)}
          </div>

          <div className="text-gray-400">
            JPY {outputImageCost.multipliedBy(jpyUsdRate).toFixed(4)}
          </div>
        </div>
      </div>
    </div>
  );
}
