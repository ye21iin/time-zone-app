import type { Metadata } from "next";
import Navbar from "@/components/NavigationBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "TimeZone | 글로벌 일정 관리",
  description: "타임존 변환 고민 없이 친구와 일정을 잡으세요.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
