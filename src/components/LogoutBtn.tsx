// src/components/LogoutButton.tsx
"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-600 transition-colors hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400"
    >
      Log out
    </button>
  );
}
