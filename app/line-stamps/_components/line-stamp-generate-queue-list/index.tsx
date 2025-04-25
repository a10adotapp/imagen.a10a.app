"use client";

import { LineStampGenerateQueue, LineStampGenerateQueueMessage, LineStampImage } from "@prisma/client";
import { Listitem } from "./_components/listitem";

export function LineStampGenerateQueueList({
  lineStampGenerateQueues,
}: {
  lineStampGenerateQueues: (
    LineStampGenerateQueue & {
      messages: (
        LineStampGenerateQueueMessage & {
          images: LineStampImage[];
        }
      )[];
    }
  )[]
}) {
  return (
    <div className="flex flex-col gap-2">
      {lineStampGenerateQueues.map((lineStampGenerateQueue) => (
        <Listitem
          key={`line-stamp-generate-queue-listitem-${lineStampGenerateQueue.id}`}
          lineStampGenerateQueue={lineStampGenerateQueue} />
      ))}
    </div>
  );
}
