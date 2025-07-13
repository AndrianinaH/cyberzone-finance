"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={
        "relative transition-colors duration-300 rounded-full w-12 h-12 flex items-center justify-center border-none shadow-md " +
        (isDark ? "bg-blue-900" : "bg-yellow-200")
      }
    >
      <span className="absolute inset-0 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-7 h-7 text-blue-300 transition-all duration-300" />
        ) : (
          <Sun className="w-7 h-7 text-yellow-500 transition-all duration-300" />
        )}
      </span>
    </Button>
  );
}
