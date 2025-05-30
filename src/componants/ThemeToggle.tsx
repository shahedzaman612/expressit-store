"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const isDark = theme === "dark";
    setIsDark(isDark);
    const html = document.documentElement;

    html.classList.toggle("dark", isDark);
    html.classList.toggle("light", !isDark);

    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);

    const html = document.documentElement;
    html.classList.toggle("dark", nextDark);
    html.classList.toggle("light", !nextDark);

    localStorage.setItem("theme", nextDark ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-1 text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
