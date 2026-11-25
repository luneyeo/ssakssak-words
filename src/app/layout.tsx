import type { ReactNode } from "react";
import type { Metadata } from "next";

import { Analytics } from "@vercel/analytics/next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import "./globals.css";

export const metadata: Metadata = {
  title: "싹싹단어",
  description: "글 속 단어를 싹싹 쓸어 담아 드려요",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className="motion-safe:scroll-smooth" data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
