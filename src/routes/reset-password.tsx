import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, FieldLabel, inputClass, primaryButtonClass } from "@/components/auth-shell";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — Vryanta" },
      { name: "description", content: "Choose a new password for your Vryanta account." },
      { property: "og:title", content: "Set a new password — Vryanta" },
      { property: "og:description", content: "Choose a new password for your Vryanta account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState<"checking" | "ok" | "invalid">("checking");
  const [pending, setPending] = useState(false);
  const [form, setForm] = useState({ password: "", confirm: "" });

  useEffect(() => {
    let cancelled = false;

    // The recovery link puts a session in place (via hash tokens or PKCE code).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled && session) setReady("ok");
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      setReady(data.session ? "ok" : "invalid");
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (form.password.length < 8) {
      toast.error("Use a password with at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords don't match.");
      return;
    }
    setPending(true);
    const { error } = await supabase.auth.updateUser({ password: form.password });
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated.");
    navigate({ to: "/dashboard", replace: true });
  }

  if (ready === "checking") {
    return (
      <AuthShell title="Set a new password" subtitle="Checking your reset link…">
        <p className="text-sm text-muted-foreground">One moment…</p>
      </AuthShell>
    );
  }

  if (ready === "invalid") {
    return (
      <AuthShell
        title="Reset link expired"
        subtitle="This password reset link is no longer valid. Request a new one and try again."
        footer={
          <Link to="/auth/login" className="font-semibold text-accent hover:underline">
            Back to log in
          </Link>
        }
      >
        <Link to="/auth/forgot-password" className={primaryButtonClass}>
          Request a new link
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Set a new password" subtitle="Choose a new password for your Vryanta account.">
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <FieldLabel>New password</FieldLabel>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            className={inputClass}
            placeholder="At least 8 characters"
          />
        </label>

        <label className="block">
          <FieldLabel>Confirm new password</FieldLabel>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={form.confirm}
            onChange={(event) => setForm((prev) => ({ ...prev, confirm: event.target.value }))}
            className={inputClass}
            placeholder="Repeat your password"
          />
        </label>

        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Saving…" : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
