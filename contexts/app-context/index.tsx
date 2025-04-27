"use client";

import { createContext, ReactNode, use } from "react";

export const AppContext = createContext<{
  appUrl?: string | undefined;
}>({});

export function useAppContext() {
  return use(AppContext);
}

export function AppContextProvider({
  appUrl,
  children,
}: {
  appUrl?: string;
  children: ReactNode;
}) {
  return (
    <AppContext value={{
      appUrl,
    }}>
      {children}
    </AppContext>
  );
}
