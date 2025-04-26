"use client";

import { Input } from "@/components/ui/input";
import { usageSchema } from "@/lib/openai-usage/usage-schema";
import { OpenaiUsage } from "@prisma/client";
import BigNumber from "bignumber.js";
import { useState } from "react";
import { z } from "zod";
import { Listitem } from "./_components/listitem";

export function OpenaiUsageList({
  openaiUsages,
}: {
  openaiUsages: OpenaiUsage[];
}) {
  const [jpyUsdRate, setJpyUsdRate] = useState(150);

  const totalCost = openaiUsages.reduce((result, openaiUsage) => {
    const parsedUsgae = usageSchema.parse(openaiUsage.usage);

    const inputTextCost = BigNumber(parsedUsgae.input_tokens_details.text_tokens)
      .multipliedBy(BigNumber(5).dividedBy(BigNumber(1000000)));

    const inputImageCost = BigNumber(parsedUsgae.input_tokens_details.image_tokens)
      .multipliedBy(BigNumber(10).dividedBy(BigNumber(1000000)));

    const outputImageCost = BigNumber(parsedUsgae.output_tokens)
      .multipliedBy(BigNumber(40).dividedBy(BigNumber(1000000)));

    return result
      .plus(inputTextCost)
      .plus(inputImageCost)
      .plus(outputImageCost);
  }, BigNumber(0));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="text-sm text-gray-400 font-bold">JPY / USD</div>

        <div>
          <Input
            value={jpyUsdRate.toFixed(0)}
            onInput={(event) => {
              const parsedJpyUsdRate = z.coerce.number().safeParse(event.currentTarget.value);

              if (parsedJpyUsdRate.success) {
                setJpyUsdRate(parsedJpyUsdRate.data);
              }
            }} />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="text-sm text-blue-600 font-bold">
            Total
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-start">
            <div>
              USD {totalCost.toFixed(4)}
            </div>

            <div>
              JPY {totalCost.multipliedBy(jpyUsdRate).toFixed(4)}
            </div>
          </div>
        </div>
      </div>

      {openaiUsages.map((openaiUsage) => (
        <Listitem
          key={`openai-usage-listitem-${openaiUsage.id}`}
          openaiUsage={openaiUsage}
          jpyUsdRate={jpyUsdRate} />
      ))}
    </div>
  );
}
