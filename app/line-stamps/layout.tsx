import { LiffContextProvider } from "@/contexts/liff-context";
import { auth } from "@/lib/auth";
import { lineMiniappLiffId } from "@/lib/env/line-miniapp-liff-id";
import { LayoutProps } from "@/lib/props";

export default async function Layout({
  children,
}: LayoutProps) {
  const session = await auth();
  const liffId = await lineMiniappLiffId();

  return (
    <LiffContextProvider session={session} liffId={liffId}>
      <div className="max-w-3xl mx-auto p-4">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </LiffContextProvider>
  );
}
