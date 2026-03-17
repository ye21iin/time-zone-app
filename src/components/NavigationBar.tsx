import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import LogoutButton from "./LogoutBtn";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-blue-600">
            🌍 TimeZone
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                  <Link href="/friends" className="hover:text-blue-600">
                    Friends
                  </Link>
                  <Link href="/plans" className="hover:text-blue-600">
                    Plans
                  </Link>
                  <Link
                    href="/plans/add"
                    className=" text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100"
                  >
                    + New plan
                  </Link>
                </div>
                <div className="h-6 w-px bg-gray-200" />
                <span className="text-xs text-gray-400 truncate max-w-[200px]">
                  {user.email}
                </span>
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm font-medium text-blue-600"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
