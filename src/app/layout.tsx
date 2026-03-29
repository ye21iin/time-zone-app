import type { Metadata } from "next";
import Navbar from "@/components/NavigationBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "OurTimeZone",
  description: "Manage global times easily",
  // 이모지를 파비콘으로
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🌍</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
