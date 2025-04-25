import { LayoutProps } from "@/lib/props";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import "./globals.css";

export const metadata: Metadata = {
  title: "マイスタンプGPT",
  description: "自分だけのスタンプ画像を作成できるミニアプリです。",
};

export default async function Layout({
  children,
}: LayoutProps) {
  return (
    <html>
      <body className="bg-gray-100">
        {children}

        <Toaster />
      </body>
    </html>
  );
}
