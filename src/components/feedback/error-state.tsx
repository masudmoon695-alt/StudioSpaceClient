"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ErrorState({
  message = "The studio service couldn't load this view. Try again.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex min-h-56 flex-col items-center justify-center rounded-card border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
    >
      <AlertCircle aria-hidden className="size-7 text-destructive" />
      <p className="measure-tight mt-3 text-sm text-foreground">{message}</p>
      <Button
        type="button"
        variant="outline"
        onClick={onRetry ?? (() => window.location.reload())}
        className="mt-5"
      >
        Try again
      </Button>
    </div>
  );
}
