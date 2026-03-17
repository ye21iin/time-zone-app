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
    <main className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-4">Time Zone App</h1>
      <p className="text-xl mb-8">
        See your friends&apos; local time at a glance and plan together with ease.
      </p>
      <a
        href="/auth/login"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
      >
        Get started
      </a>
    </main>
  );
}
