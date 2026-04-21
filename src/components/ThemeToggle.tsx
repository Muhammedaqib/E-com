"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setValue] = useState(false);

  useEffect(() => {
    setValue(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit">
      <button
        onClick={() => setTheme("light")}
        className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1 ${
          theme === "light" 
            ? "bg-white text-slate-900 shadow-sm" 
            : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
        }`}
      >
        <span>☀️</span> Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1 ${
          theme === "dark" 
            ? "bg-slate-900 text-amber-400 shadow-sm border border-slate-700" 
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <span>🌙</span> Dark
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`px-4 py-2 rounded-lg text-sm font-bold transition flex items-center gap-1 ${
          theme === "system" 
            ? "bg-slate-500 text-white shadow-sm" 
            : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <span>💻</span> System
      </button>
    </div>
  );
}
