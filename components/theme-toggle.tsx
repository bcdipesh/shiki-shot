"use client";

import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="flex gap-1">
      <Button variant="ghost" size="icon" onClick={() => setTheme("light")}>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
        <Moon className="absolute h-[1.2rem] w-[1.2rem]" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setTheme("dark")}>
        <Monitor className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    </div>
  );
}
