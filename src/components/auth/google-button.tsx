"use client";

import { useState } from "react";
import { FaGoogle } from "react-icons/fa6";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";

export function GoogleButton({ callbackUrl }: { callbackUrl: string }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}${callbackUrl}`,
    });

    if (error) {
      const message = authErrorMessage(error);
      toast.error(message);
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleClick}
      disabled={loading}
    >
      <FaGoogle aria-hidden className="size-4" />
      {loading ? "Opening Google…" : "Continue with Google"}
    </Button>
  );
}
