"use client";

import { useEffect } from "react";
import { Suspense } from "react";
import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { PageSkeleton } from "@/components/feedback/page-skeleton";
import { authClient } from "@/lib/auth-client";

/**
 * Waits for the session to finish loading before deciding anything, so a
 * signed-in reload never bounces through /login.
 */
export function PrivateRoute({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<PageSkeleton label="Checking your session" />}>
      <PrivateRouteContent>{children}</PrivateRouteContent>
    </Suspense>
  );
}

function PrivateRouteContent({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, session, pathname, router]);

  if (isPending || !session) {
    return <PageSkeleton label="Checking your session" />;
  }

  return <>{children}</>;
}
