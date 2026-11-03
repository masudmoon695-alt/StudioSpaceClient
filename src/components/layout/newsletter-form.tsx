"use client";

import { useId, useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm() {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();

    if (!EMAIL_PATTERN.test(value)) {
      const message = "Enter a full email address, like name@studio.com.";
      setError(message);
      toast.error(message);
      return;
    }

    setError(null);
    setEmail("");
    toast.success("You're on the call sheet. The first issue lands next month.");
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-3">
      <Label htmlFor={inputId} className="text-sm font-medium">
        Email address
      </Label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
        <Button type="submit" className="sm:w-auto">
          Subscribe
        </Button>
      </div>
      <p
        id={errorId}
        aria-live="polite"
        className="min-h-5 text-sm text-destructive"
      >
        {error}
      </p>
    </form>
  );
}
