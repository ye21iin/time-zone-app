// src/app/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/friends");
  }

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.15),_transparent_40%),linear-gradient(to_bottom,_transparent,_rgba(148,163,184,0.08))] px-6 py-24 dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(to_bottom,_transparent,_rgba(15,23,42,0.7))]">
      <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-slate-100">Time Zone App</h1>
      <p className="mb-8 text-center text-xl text-gray-600 dark:text-slate-300">
        See your friends&apos; local time at a glance and plan together with ease.
      </p>
      <a
        href="/auth/login"
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
      >
        Get started
      </a>
    </main>
  );
}
