import type { Metadata } from "next";
import Navbar from "@/components/NavigationBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "TimeZone | Plan across time zones",
  description: "Schedule with friends around the world without worrying about time zones.",
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
