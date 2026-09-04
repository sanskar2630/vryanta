import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/vryanta-logo.png.asset.json";
import { useSession } from "@/hooks/use-vryanta";
import { cn } from "@/lib/utils";

const links = [
  { to: "/jobs", label: "Jobs" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About" },
  { to: "/for-employers", label: "For Employers" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session, loading } = useSession();
  const signedIn = Boolean(session);

  return (
    <header className="fluid sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto grid h-16 w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img src={logoAsset.url} alt="Vryanta logo" className="size-9 shrink-0 rounded-lg object-cover" />
          <span className="truncate font-display text-lg font-semibold tracking-tight">Vryanta</span>
        </Link>

        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-1 text-sm font-medium md:flex">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="fluid rounded-md px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "text-foreground bg-secondary/70" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 pl-2 md:flex">
            {loading ? (
              <span className="h-9 w-40 animate-pulse rounded-lg bg-secondary" />
            ) : signedIn ? (
              <Link
                to="/dashboard"
                className="lift-press rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="fluid rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="lift-press rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                >
                  Create Profile
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="lift-press inline-flex size-10 items-center justify-center rounded-lg border border-border text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid overflow-hidden border-t border-border/70 transition-[grid-template-rows,opacity] duration-300 ease-out-expo md:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] border-transparent opacity-0",
        )}
      >
        <nav className="min-h-0">
          <ul className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-3 text-sm font-medium">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="fluid block rounded-lg px-3 py-2.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "text-foreground bg-secondary/70" }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 grid gap-2">
              {signedIn ? (
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="lift-press rounded-lg bg-primary px-4 py-2.5 text-center font-semibold text-primary-foreground"
                >
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    onClick={() => setOpen(false)}
                    className="lift-press rounded-lg border border-input px-4 py-2.5 text-center font-semibold"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    onClick={() => setOpen(false)}
                    className="lift-press rounded-lg bg-primary px-4 py-2.5 text-center font-semibold text-primary-foreground"
                  >
                    Create Profile
                  </Link>
                </>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
