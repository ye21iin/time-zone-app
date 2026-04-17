"use client";

import { useState } from "react";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.dataset.theme = theme;
}

export default function ThemeToggle({
  initialTheme,
}: {
  initialTheme: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  const nextTheme: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      onClick={() => {
        const next = nextTheme;
        applyTheme(next);
        window.localStorage.setItem("theme", next);
        document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
        setTheme(next);
      }}
      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
    >
      <span className="text-base" aria-hidden="true">
        {theme === "dark" ? "🌙" : "☀️"}
      </span>
      <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
    </button>
  );
}
