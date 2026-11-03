import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthFormSkeleton } from "@/components/auth/auth-form-skeleton";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Create a StudioSpace account to book creative spaces by the hour or list your own studio.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthFormSkeleton fields={4} />}>
      <RegisterForm />
    </Suspense>
  );
}
