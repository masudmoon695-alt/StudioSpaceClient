"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut } from "lucide-react";
import { toast } from "sonner";

import { UserAvatar } from "@/components/layout/user-avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { PRIVATE_NAV_LINKS } from "@/lib/constants";
import { clearExpressSession } from "@/lib/express-session-client";
import { displayName } from "@/lib/user";

interface AuthMenuProps {
  layout: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function AuthMenu({ layout, onNavigate }: AuthMenuProps) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  if (isPending) {
    return layout === "desktop" ? (
      <span
        aria-hidden
        className="block size-11 animate-pulse rounded-full bg-muted"
      />
    ) : (
      <div aria-hidden className="space-y-2">
        <div className="h-11 animate-pulse rounded-control bg-muted" />
        <div className="h-11 animate-pulse rounded-control bg-muted" />
      </div>
    );
  }

  if (!session) {
    if (layout === "desktop") {
      return (
        <div className="flex items-center gap-2">
          <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
            Login
          </Link>
          <Link href="/register" className={buttonVariants()}>
            Register
          </Link>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <Link
          href="/login"
          onClick={onNavigate}
          className={buttonVariants({ variant: "outline" })}
        >
          Login
        </Link>
        <Link
          href="/register"
          onClick={onNavigate}
          className={buttonVariants()}
        >
          Register
        </Link>
      </div>
    );
  }

  const name = displayName(session.user.name, session.user.email);

  async function handleSignOut() {
    setSigningOut(true);
    // Leave private screens before the session state lands, so the route
    // guard doesn't redirect mid-logout.
    router.replace("/");
    await authClient.signOut();
    await clearExpressSession();
    toast.success("Signed out.");
  }

  if (layout === "mobile") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-control bg-muted/60 p-3">
          <UserAvatar
            name={name}
            image={session.user.image}
            className="size-10"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </div>

        <nav aria-label="Account" className="flex flex-col gap-1">
          {PRIVATE_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className="flex min-h-11 items-center gap-2.5 rounded-control px-3 text-base transition-colors hover:bg-muted"
            >
              <link.icon
                aria-hidden
                className="size-4 text-muted-foreground"
              />
              {link.label}
            </Link>
          ))}
        </nav>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleSignOut}
          disabled={signingOut}
        >
          <LogOut aria-hidden />
          {signingOut ? "Signing out…" : "Logout"}
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open account menu"
        className="flex h-11 items-center gap-1.5 rounded-full border border-border bg-card pr-2.5 pl-1 transition-colors hover:bg-muted"
      >
        <UserAvatar name={name} image={session.user.image} />
        <ChevronDown aria-hidden className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3 py-2">
            <span className="block truncate text-sm font-medium text-foreground">
              {name}
            </span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {session.user.email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {PRIVATE_NAV_LINKS.map((link) => (
          <DropdownMenuItem
            key={link.href}
            render={<Link href={link.href} />}
            className="min-h-11 px-3"
          >
            <link.icon aria-hidden className="size-4 text-muted-foreground" />
            {link.label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          className="min-h-11 px-3"
          disabled={signingOut}
          onClick={handleSignOut}
        >
          <LogOut aria-hidden className="size-4" />
          {signingOut ? "Signing out…" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
