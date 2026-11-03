/**
 * Keeps the Express API cookie in step with the Better Auth session.
 * Returns false when the mirror failed, so callers can warn instead of
 * pretending the API will accept later mutations.
 */
export async function syncExpressSession(): Promise<boolean> {
  try {
    const response = await fetch("/api/session/express", {
      method: "POST",
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function clearExpressSession(): Promise<boolean> {
  try {
    const response = await fetch("/api/session/express", {
      method: "DELETE",
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}
