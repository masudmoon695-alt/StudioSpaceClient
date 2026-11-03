"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { AuthFormSkeleton } from "@/components/auth/auth-form-skeleton";
import { GoogleButton } from "@/components/auth/google-button";
import { PasswordRules } from "@/components/auth/password-rules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import { clearExpressSession } from "@/lib/express-session-client";
import {
  isHttpUrl,
  isValidEmail,
  passwordMeetsRules,
  safeReturnPath,
} from "@/lib/validators";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = safeReturnPath(searchParams.get("callbackUrl"));
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
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

  if (isPending) return <AuthFormSkeleton fields={4} />;
  if (session) return null;

  function loginHref() {
    return returnTo === "/"
      ? "/login"
      : `/login?callbackUrl=${encodeURIComponent(returnTo)}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhoto = photoUrl.trim();

    if (trimmedName.length < 2) {
      fail("Enter your name so hosts know who's booking.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      fail("Enter a valid email address.");
      return;
    }

    if (trimmedPhoto && !isHttpUrl(trimmedPhoto)) {
      fail("Photo URL must start with http:// or https://.");
      return;
    }

    if (!passwordMeetsRules(password)) {
      fail(
        "Password needs at least 6 characters, one uppercase letter and one lowercase letter.",
      );
      return;
    }

    setSubmitting(true);
    setError(null);
    // The session created by sign-up must not trigger the signed-in redirect;
    // this form finishes on the login page.
    leaving.current = true;

    const { error: signUpError } = await authClient.signUp.email({
      name: trimmedName,
      email: trimmedEmail,
      password,
      image: trimmedPhoto || undefined,
    });

    if (signUpError) {
      const message = authErrorMessage(signUpError);
      setError(message);
      toast.error(message);
      setSubmitting(false);
      return;
    }

    // Registration finishes on the login page, so end the session Better Auth
    // created and let the user sign in deliberately.
    await authClient.signOut();
    await clearExpressSession();

    toast.success("Account created. Sign in to continue.");
    leaving.current = true;
    router.replace(loginHref());
    router.refresh();
  }

  function fail(message: string) {
    setError(message);
    toast.error(message);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <h2 className="text-h3">Create your account</h2>
        <p className="text-sm text-muted-foreground">
          Book rooms, list your own space, and keep every request on one call
          sheet.
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
          <Label htmlFor="register-name">Name</Label>
          <Input
            id="register-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
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
          <Label htmlFor="register-photo">Photo URL</Label>
          <Input
            id="register-photo"
            name="photoUrl"
            type="url"
            inputMode="url"
            autoComplete="url"
            value={photoUrl}
            onChange={(event) => setPhotoUrl(event.target.value)}
            aria-describedby="register-photo-help"
          />
          <p id="register-photo-help" className="text-xs text-muted-foreground">
            Optional. Paste a link to a photo of you. Without one, your initials
            stand in.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="register-password">Password</Label>
          <div className="relative">
            <Input
              id="register-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              aria-describedby="register-password-rules"
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
          <div id="register-password-rules">
            <PasswordRules value={password} />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? (
            <Loader2 aria-hidden className="animate-spin" />
          ) : null}
          {submitting ? "Creating your account…" : "Register"}
        </Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={loginHref()}
          className="font-medium text-daylight underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
