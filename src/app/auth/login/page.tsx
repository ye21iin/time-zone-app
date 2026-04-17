"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 dark:bg-slate-950">
      <button
        onClick={handleGoogleLogin}
        className="rounded-lg border border-gray-300 bg-white p-4 text-gray-900 shadow-sm hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      >
        Continue with Google
      </button>
    </div>
  );
}
