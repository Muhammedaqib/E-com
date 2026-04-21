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
        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
          theme === "light" 
            ? "bg-white text-slate-900 shadow-sm" 
            : "text-slate-500 hover:text-slate-700"
        }`}
      >
        ☀️ Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
          theme === "dark" 
            ? "bg-slate-950 text-white shadow-sm" 
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        🌙 Dark
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${
          theme === "system" 
            ? "bg-slate-500 text-white shadow-sm" 
            : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        💻 System
      </button>
    </div>
  );
}
