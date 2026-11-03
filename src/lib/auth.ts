import { MongoClient } from "mongodb";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins/jwt";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error(
    "MONGODB_URI is not set. Better Auth needs it to store sessions.",
  );
}

/**
 * Dev hot reloads re-evaluate this module, so the client lives on globalThis
 * to avoid opening a new connection pool on every reload.
 */
const globalForAuth = globalThis as unknown as {
  studioSpaceMongoClient?: MongoClient;
};

const mongoClient =
  globalForAuth.studioSpaceMongoClient ?? new MongoClient(mongoUri);

globalForAuth.studioSpaceMongoClient = mongoClient;

const googleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(mongoClient.db(), {
    client: mongoClient,
    transaction: false,
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    requireEmailVerification: false,
    // Password resets are deliberately out of scope for this version.
    sendResetPassword: async () => {
      throw new Error("Password reset is not available in this version.");
    },
  },
  socialProviders: googleConfigured
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    : {},
  plugins: [
    jwt({
      jwt: {
        issuer: "studio-space",
        audience: "studio-space",
        expirationTime: "7d",
        definePayload: async (data) => {
          const context = data as {
            user?: { email?: string; name?: string };
            session?: { user?: { email?: string; name?: string } };
          };
          const email =
            context?.user?.email ?? context?.session?.user?.email ?? "";
          const name =
            context?.user?.name ?? context?.session?.user?.name ?? "";
          return { email, name };
        },
      },
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
});
