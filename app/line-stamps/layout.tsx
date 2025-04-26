import { LiffContextProvider } from "@/contexts/liff-context";
import { auth } from "@/lib/auth";
import { lineMiniappLiffId } from "@/lib/env/line-miniapp-liff-id";
import { LayoutProps } from "@/lib/props";
import Link from "next/link";

export default async function Layout({
  children,
}: LayoutProps) {
  const session = await auth();
  const liffId = await lineMiniappLiffId();

  return (
    <LiffContextProvider session={session} liffId={liffId}>
      <div className="max-w-3xl min-h-dvh mx-auto p-4">
        <div className="flex flex-col gap-4">
          <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
            {children}
          </div>

          <hr className="mx-auto w-24" />

          <div className="flex flex-col items-center gap-2">
            <div className="text-xs text-gray-400">
              <Link href="/about/line-stamps">
                このアプリについて
              </Link>
            </div>
          </div>
        </div>
      </div>
    </LiffContextProvider>
  );
}
