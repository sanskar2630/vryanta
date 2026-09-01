import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, FieldLabel, inputClass, primaryButtonClass } from "@/components/auth-shell";
import { GoogleButton } from "@/components/google-button";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "Log in to Vryanta" },
      {
        name: "description",
        content: "Sign in to Vryanta to track applications, save opportunities and see jobs matched to your profile.",
      },
      { property: "og:title", content: "Log in to Vryanta" },
      { property: "og:description", content: "Sign in to track applications and see your matched opportunities." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });
    setPending(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Welcome back!");
    navigate({ to: "/dashboard" });
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your job search."
      footer={
        <>
          New to Vryanta?{" "}
          <Link to="/auth/signup" className="font-semibold text-accent hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <GoogleButton label="Continue with Google" />

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
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
            value={form.email}
            onChange={update("email")}
            className={inputClass}
            placeholder="you@university.edu"
          />
        </label>

        <label className="block">
          <FieldLabel>Password</FieldLabel>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={update("password")}
            className={inputClass}
            placeholder="Your password"
          />
        </label>

        <div className="text-right text-sm">
          <Link to="/auth/forgot-password" className="text-accent hover:underline">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={pending} className={primaryButtonClass}>
          <Mail className="size-4" />
          {pending ? "Signing in…" : "Log in"}
        </button>
      </form>
    </AuthShell>
  );
}
