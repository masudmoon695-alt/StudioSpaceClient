import { SignJWT } from "jose";

/**
 * The Express API reads its own HTTPOnly cookie and verifies it with
 * BETTER_AUTH_SECRET. Better Auth owns the user store, so this module mints the
 * API token from a verified Better Auth session instead of asking the user to
 * sign in twice.
 */
export const EXPRESS_AUTH_COOKIE = "studio_space_token";

const SESSION_SECONDS = 60 * 60 * 24 * 7;

export interface ExpressUser {
  id: string;
  email: string;
  name: string;
}

export async function signExpressToken(user: ExpressUser): Promise<string> {
  const secret = process.env.BETTER_AUTH_SECRET;

  if (!secret) {
    throw new Error(
      "BETTER_AUTH_SECRET is required to sign API session cookies.",
    );
  }

  return new SignJWT({ email: user.email, name: user.name, role: "creator" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secret));
}

export function expressCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_SECONDS,
  };
}
