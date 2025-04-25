import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { LineStampsCreateForm } from "./_components/line-stamp-generate-queue-create-form";

export default async function Page() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/line-stamps">
            <div className="flex items-center gap-1">
              <ChevronLeft size={12} />

              <div>戻る</div>
            </div>
          </Link>
        </Button>
      </div>

      <LineStampsCreateForm />
    </div>
  );
}
