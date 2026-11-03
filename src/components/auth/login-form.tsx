"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AuthFormSkeleton } from "@/components/auth/auth-form-skeleton";
import { ForgotPasswordDialog } from "@/components/auth/forgot-password-dialog";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import { syncExpressSession } from "@/lib/express-session-client";
import { isValidEmail, safeReturnPath } from "@/lib/validators";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturnPath(searchParams.get("callbackUrl"));
  const { data: session, isPending } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const leaving = useRef(false);

  useEffect(() => {
    if (isPending || !session || leaving.current) return;
    leaving.current = true;
    router.replace(returnTo);
  }, [isPending, session, returnTo, router]);

  if (isPending) return <AuthFormSkeleton />;
  if (session) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedEmail = email.trim();

    if (!isValidEmail(trimmedEmail)) {
      const message = "Enter a valid email address.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!password) {
      const message = "Enter your password.";
      setError(message);
      toast.error(message);
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error: signInError } = await authClient.signIn.email({
      email: trimmedEmail,
      password,
      rememberMe: true,
    });

    if (signInError) {
      const message = authErrorMessage(signInError);
      setError(message);
      toast.error(message);
      setSubmitting(false);
      return;
    }

    const synced = await syncExpressSession();
    toast.success("Signed in.");

    if (!synced) {
      toast.warning(
        "Signed in, but the booking API session didn't sync. Reload before booking.",
      );
    }

    leaving.current = true;
    router.replace(returnTo);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-h3">Sign in</h2>
        <p className="text-sm text-muted-foreground">
          Pick up where you left off. Your bookings and listings are waiting on
          your dashboard.
        </p>
      </div>

      <GoogleButton callbackUrl={returnTo} />

      <div aria-hidden className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {error ? (
          <p
            role="alert"
            className="rounded-control border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="login-password">Password</Label>
            <ForgotPasswordDialog />
          </div>
          <div className="relative">
            <Input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex size-11 items-center justify-center rounded-control text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff aria-hidden className="size-4" />
              ) : (
                <Eye aria-hidden className="size-4" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? (
            <Loader2 aria-hidden className="animate-spin" />
          ) : null}
          {submitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        New to StudioSpace?{" "}
        <Link
          href={
            returnTo === "/"
              ? "/register"
              : `/register?callbackUrl=${encodeURIComponent(returnTo)}`
          }
          className="font-medium text-daylight underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
