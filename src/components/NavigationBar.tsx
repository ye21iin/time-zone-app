// src/components/Navbar.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutBtn";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            🌍 TimeZone
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/friends/add"
                  className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100"
                >
                  + 친구 추가
                </Link>
                <span className="text-sm text-gray-500">{user.email}</span>
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm font-medium text-blue-600"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
