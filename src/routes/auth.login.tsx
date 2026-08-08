import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, FieldLabel, inputClass, primaryButtonClass } from "@/components/auth-shell";
import { GoogleButton } from "@/components/google-button";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Log in — Vryanta" },
      { name: "description", content: "Log in to Vryanta to track applications, saved jobs and your digital resume." },
      { property: "og:title", content: "Log in — Vryanta" },
      { property: "og:description", content: "Access your Vryanta profile, applications and job matches." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Email or password is incorrect." : error.message);
      setPending(false);
      return;
    }
    const accountType = (data.user?.user_metadata as { account_type?: string } | undefined)?.account_type;
    toast.success("Welcome back to Vryanta.");
    navigate({ to: accountType === "employer" ? "/employer" : "/dashboard" });
  }

  return (
    <AuthShell
      title="Welcome back to Vryanta"
      subtitle="Log in to continue building your profile and applying to roles."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/auth/signup" className="font-semibold text-accent hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <GoogleButton />

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <FieldLabel>Email</FieldLabel>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            placeholder="you@example.com"
          />
        </label>
        <label className="block">
          <FieldLabel>Password</FieldLabel>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            placeholder="••••••••"
          />
        </label>

        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Logging in…" : "Log In"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <Link to="/auth/forgot-password" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Forgot Password?
        </Link>
      </div>
    </AuthShell>
  );
}
