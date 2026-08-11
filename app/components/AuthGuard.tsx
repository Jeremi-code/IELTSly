"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Logo from "./Logo";

/**
 * Wraps protected pages. Redirects to /signin if the user has no active session.
 * Shows a branded loading state while the session is being verified.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#E4EEFF] via-white to-[#E4EEFF] dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-500">
          <Logo className="w-16 h-16 animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
