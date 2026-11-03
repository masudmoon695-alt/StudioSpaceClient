import Link from "next/link";
import { Aperture } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Set on the footer, where the mark closes the page instead of opening it. */
  tone?: "default" | "muted";
}

export function Logo({ className, tone = "default" }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="StudioSpace home"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-control",
        tone === "muted" && "text-foreground",
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-control bg-primary text-primary-foreground"
      >
        <Aperture className="size-5" />
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight">
        StudioSpace
      </span>
    </Link>
  );
}
