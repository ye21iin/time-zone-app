import type { Metadata } from "next";
import { cookies } from "next/headers";
import Footer from "@/components/Footer";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const theme = themeCookie === "dark" ? "dark" : "light";

  return (
    <html lang="en" className={theme === "dark" ? "dark" : undefined} data-theme={theme}>
      <body className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <Footer initialTheme={theme} />
        </div>
      </body>
    </html>
  );
}
