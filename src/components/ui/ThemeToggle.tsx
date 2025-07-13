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
      className="relative transition-colors"
    >
      <Sun
        className={`h-[1.5rem] w-[1.5rem] transition-all ${
          isDark ? "opacity-0 scale-0" : "opacity-100 scale-100"
        }`}
      />
      <Moon
        className={`absolute h-[1.5rem] w-[1.5rem] transition-all ${
          isDark ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      />
    </Button>
  );
}
