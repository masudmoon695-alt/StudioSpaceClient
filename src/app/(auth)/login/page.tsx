import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthFormSkeleton } from "@/components/auth/auth-form-skeleton";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to book studio time, track requests and manage the creative spaces you host.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
