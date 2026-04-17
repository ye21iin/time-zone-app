import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import LogoutButton from "./LogoutBtn";
import MobileNavMenu from "./MobileNavMenu";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
            🌍 TimeZone
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-slate-300">
                  <Link href="/friends" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Friends
                  </Link>
                  <Link href="/plans" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Plans
                  </Link>
                  <Link
                    href="/plans/add"
                    className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/70"
                  >
                    + New plan
                  </Link>
                </div>
                <MobileNavMenu email={user.email ?? ""} />

                <div className="hidden md:block h-6 w-px bg-gray-200 dark:bg-slate-700" />
                <span className="hidden md:inline text-xs text-gray-400 truncate max-w-[200px] dark:text-slate-500">
                  {user.email}
                </span>
                <div className="hidden md:block">
                  <LogoutButton />
                </div>
              </>
            ) : (
              <Link
                href="/auth/login"
                className="text-sm font-medium text-blue-600 dark:text-blue-400"
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
