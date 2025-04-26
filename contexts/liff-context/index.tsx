"use client";

import { LoadingAssets, LoadingSession } from "@/components/loading";
import liff, { Liff } from "@line/liff";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, use, useEffect, useState } from "react";

export const LiffContext = createContext<{
  liff?: Liff | undefined;
  error: Error | null;
}>({
  error: null,
});

export function useLiffContext() {
  return use(LiffContext);
}

export function LiffContextProvider({
  session,
  liffId,
  children,
}: {
  session: Session | null;
  liffId: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const [liffObject, setLiffObject] = useState<Liff | undefined>();

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    liff.init({ liffId })
      .then(async () => {
        if (!session) {
          const liffContext = liff.getContext()

          const userId = liffContext?.userId;

          if (!userId) {
            setError(new Error("failed to get context"));

            return;
          }

          await signIn("credentials", {
            type: "liff",
            lineUserId: userId,
            redirect: false,
          });

          router.refresh();
        }

        setLiffObject(liff);
      })
      .catch((error: Error) => {
        setError(error);
      });
  }, []);

  return (
    <LiffContext value={{
      liff: liffObject,
      error,
    }}>
      {(() => {
        if (!liffObject) {
          return <LoadingAssets />;
        }

        if (!session) {
          return <LoadingSession />;
        }

        return children;
      })()}
    </LiffContext>
  );
}
