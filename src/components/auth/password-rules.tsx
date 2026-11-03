"use client";

import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { PASSWORD_RULES } from "@/lib/validators";

export function PasswordRules({ value }: { value: string }) {
  return (
    <ul aria-live="polite" className="mt-2 space-y-1.5">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(value);

        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-start gap-2 text-xs",
              met ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {met ? (
              <Check aria-hidden className="mt-0.5 size-3.5 shrink-0 text-positive" />
            ) : (
              <X aria-hidden className="mt-0.5 size-3.5 shrink-0" />
            )}
            <span>
              <span className="sr-only">
                {met ? "Requirement met: " : "Not met yet: "}
              </span>
              {rule.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
