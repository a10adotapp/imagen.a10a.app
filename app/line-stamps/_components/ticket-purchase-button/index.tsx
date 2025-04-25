"use client";

import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { createStripeCheckoutSession } from "./_actions/create-stripe-checkout-session";

export function TicketPurchaseButton() {
  const [isBusy, setIsBusy] = useState(false);

  const clickHandler = useCallback(async () => {
    try {
      setIsBusy(true);

      const url = await toast.promise(createStripeCheckoutSession(), {
        loading: "請求情報を作成しています...",
        error: "請求情報を作成できませんでした",
        success: "請求情報の作成に成功しました",
      });

      window.open(url);
    } finally {
      setIsBusy(false);
    }
  }, []);

  return (
    <Button
      type="button"
      onClick={clickHandler}
      disabled={isBusy}
      className="bg-linear-to-r from-emerald-400 to-cyan-400">
      <div className="flex items-center gap-2">
        <Ticket size={12} />

        <div className="font-bold">チケットを購入してマイスタンプを作成する</div>
      </div>
    </Button>
  );
}
