import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InitialsAvatar } from "@/components/initials-avatar";
import { CursorGlow } from "@/components/interactive";
import { useNotifications, useProfile } from "@/hooks/use-vryanta";
import logoAsset from "@/assets/vryanta-logo.png.asset.json";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof Home; mobile?: boolean };

const seekerNav: NavItem[] = [
  { to: "/dashboard", label: "Home", icon: Home, mobile: true },
  { to: "/find-jobs", label: "Find Jobs", icon: Search, mobile: true },
  { to: "/applications", label: "Applications", icon: Briefcase, mobile: true },
  { to: "/saved", label: "Saved Jobs", icon: Bookmark, mobile: true },
  { to: "/alerts", label: "Job Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User, mobile: true },
  { to: "/resume", label: "Resume", icon: FileText },
];

const employerNav: NavItem[] = [
  { to: "/employer", label: "Overview", icon: LayoutDashboard, mobile: true },
  { to: "/employer/post-job", label: "Post Job", icon: Briefcase, mobile: true },
  { to: "/employer/jobs", label: "My Jobs", icon: FileText, mobile: true },
  { to: "/employer/applicants", label: "Applicants", icon: Users, mobile: true },
  { to: "/employer/company", label: "Company Profile", icon: Building2, mobile: true },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  const isEmployer = profile?.account_type === "employer";
  const nav = isEmployer ? employerNav : seekerNav;
  const mobileNav = nav.filter((item) => item.mobile).slice(0, 5);
  const displayName = isEmployer ? profile?.company_name || profile?.full_name : profile?.full_name;

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth/login", replace: true });
  }

  const isActive = (to: string) =>
    to === "/employer" ? pathname === "/employer" : pathname === to || pathname.startsWith(`${to}/`);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to={isEmployer ? "/employer" : "/dashboard"} className="flex items-center gap-2">
            <img src={logoAsset.url} alt="Vryanta logo" className="size-9 rounded-lg object-cover" />
            <span className="font-display text-lg font-semibold tracking-tight">Vryanta</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.to) ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 transition-colors hover:bg-secondary"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <InitialsAvatar name={displayName} src={profile?.avatar_url} className="size-8" />
              <span className="hidden max-w-[10rem] truncate text-sm font-medium sm:block">
                {displayName || "Your account"}
              </span>
            </button>

            {menuOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-popover p-1 shadow-xl">
                  <div className="px-3 py-2">
                    <p className="truncate text-sm font-semibold">{displayName || "Vryanta user"}</p>
                    <p className="truncate text-xs text-muted-foreground">{profile?.email}</p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wide text-accent">
                      {isEmployer ? "Employer" : "Job seeker"}
                    </p>
                  </div>
                  <div className="my-1 h-px bg-border" />
                  <Link
                    to={isEmployer ? "/employer/company" : "/profile"}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <User className="size-4" /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <Settings className="size-4" /> Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-secondary"
                  >
                    <LogOut className="size-4" /> Logout
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-8 sm:px-6 lg:pb-16">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur lg:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                    isActive(item.to) ? "text-accent" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description ? <p className="mt-1.5 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
