import { Button } from "@/components/ui/button";
import Link from "next/link";
import { countLineStampTicketCached } from "./_actions/count-line-stamp-ticket";
import { listLineStampGenerateQueueCached } from "./_actions/list-line-stamp-generate-queue";
import { LineStampGenerateQueueList } from "./_components/line-stamp-generate-queue-list";
import { TicketPurchaseButton } from "./_components/ticket-purchase-button";

export default async function Page() {
  const lineStampTicketCount = await countLineStampTicketCached();

  const lineStampGenerateQueues = await listLineStampGenerateQueueCached();

  return (
    <div className="flex flex-col gap-4">
      {lineStampTicketCount === 0 && (
        <TicketPurchaseButton />
      )}

      {lineStampTicketCount > 0 && (
        <Button asChild className="bg-linear-to-r from-emerald-400 to-cyan-400">
          <Link href="/line-stamps/new">
            <div className="font-bold">
              マイスタンプを作る
            </div>
          </Link>
        </Button>
      )}

      <hr />

      {lineStampGenerateQueues.length === 0 && (
        <div className="text-center text-sm font-bold">マイスタンプが作成されていません</div>
      )}

      {lineStampGenerateQueues.length > 0 && (
        <LineStampGenerateQueueList
          lineStampGenerateQueues={lineStampGenerateQueues} />
      )}
    </div>
  );
}
