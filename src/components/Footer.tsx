import ThemeToggle from "./ThemeToggle";

export default function Footer({
  initialTheme,
}: {
  initialTheme: "light" | "dark";
}) {
  return (
    <footer className="border-t border-gray-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
            OurTimeZone
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
            Compare local times, plan shared events, and keep timezone context visible.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle initialTheme={initialTheme} />
        </div>
      </div>
    </footer>
  );
}
