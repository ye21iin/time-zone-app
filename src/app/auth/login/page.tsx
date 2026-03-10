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
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleGoogleLogin}
        className="bg-white border border-gray-300 p-4 rounded-lg shadow-sm hover:bg-gray-50"
      >
        Google로 로그인하기
      </button>
    </div>
  );
}
