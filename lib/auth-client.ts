import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
});

// Export convenience methods
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;

// Export inferred types
export type Session = typeof authClient.$Infer.Session;
