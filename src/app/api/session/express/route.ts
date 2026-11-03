import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import {
  EXPRESS_AUTH_COOKIE,
  expressCookieOptions,
  signExpressToken,
} from "@/lib/express-token";

/**
 * Mirrors the Better Auth session into the cookie the Express API expects.
 * Called after email sign-in and whenever a session is discovered on load
 * (for example after the Google redirect).
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json(
      { message: "Sign in before requesting an API session." },
      { status: 401 },
    );
  }

  const token = await signExpressToken({
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
  });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(EXPRESS_AUTH_COOKIE, token, expressCookieOptions());

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(EXPRESS_AUTH_COOKIE, "", {
    ...expressCookieOptions(),
    maxAge: 0,
  });

  return response;
}
