"use client";

import { useEffect, useRef } from "react";

import { authClient } from "@/lib/auth-client";
import {
  clearExpressSession,
  syncExpressSession,
} from "@/lib/express-session-client";

/**
 * Covers sessions created by the Google redirect, where no form handler can
 * run afterwards. Email sign-in also calls the mirror directly.
 */
export function ExpressSessionSync() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id ?? null;
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    if (userId) {
      if (syncedFor.current === userId) return;
      syncedFor.current = userId;
      void syncExpressSession().then((ok) => {
        if (!ok) syncedFor.current = null;
      });
      return;
    }

    if (syncedFor.current) {
      syncedFor.current = null;
      void clearExpressSession();
    }
  }, [userId]);

  return null;
}
