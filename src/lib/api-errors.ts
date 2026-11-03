import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { isUnauthorized } from "@/lib/api";

interface SessionUserLike {
  id: string;
  email?: string;
  name?: string | null;
}

function sessionUserFromResult(
  session: unknown,
): SessionUserLike | null {
  const candidate = session as
    | { user?: SessionUserLike | null; data?: { user?: SessionUserLike | null } | null }
    | null;

  const user = candidate?.user ?? candidate?.data?.user ?? null;
  return user ?? null;
}

export async function redirectIfUnauthorized(
  error: unknown,
  router: { push: (href: string) => void },
  callbackPath: string,
): Promise<boolean> {
  if (!isUnauthorized(error)) return false;

  const user = sessionUserFromResult(await authClient.getSession());

  if (!user) {
    toast.error("Your session expired. Sign in to continue.");
    router.push(`/login?callbackUrl=${encodeURIComponent(callbackPath)}`);
    return true;
  }

  console.error("The studio API rejected an authorized request.", error);

  return false;
}
