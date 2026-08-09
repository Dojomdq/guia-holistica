"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-cream-200/60 dark:hover:bg-bark-700 transition-colors"
      aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-bark-500" />
      ) : (
        <Sun className="h-4 w-4 text-cream-100" />
      )}
    </button>
  );
}
