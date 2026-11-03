"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { buttonVariants } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger
        type="button"
        aria-label="Toggle color theme"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <Sun aria-hidden className="hidden dark:block" />
        <Moon aria-hidden className="dark:hidden" />
      </TooltipTrigger>
      <TooltipContent side="bottom">Toggle color theme</TooltipContent>
    </Tooltip>
  );
}
