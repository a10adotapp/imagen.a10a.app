import { LayoutProps } from "@/lib/props";
import { Toaster } from "react-hot-toast";

import "./globals.css";

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
