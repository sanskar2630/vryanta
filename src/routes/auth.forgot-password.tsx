import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, FieldLabel, inputClass, primaryButtonClass } from "@/components/auth-shell";

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Vryanta" },
      { name: "description", content: "Request a secure password reset link for your Vryanta account." },
      { property: "og:title", content: "Reset your password — Vryanta" },
      { property: "og:description", content: "Request a secure password reset link for your Vryanta account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + "/reset-password",
    });
    setPending(false);
    // Always show the same confirmation so account existence isn't revealed.
    if (resetError && /rate|too many/i.test(resetError.message)) {
      setError("Too many attempts. Please wait a minute and try again.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter the email you signed up with and we'll send a secure reset link."
      footer={
        <Link to="/auth/login" className="font-semibold text-accent hover:underline">
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/60 p-4 text-sm">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
          <p className="text-muted-foreground">
            If an account exists for <span className="font-medium text-foreground">{email}</span>, a reset link is on its
            way. The link expires shortly, so use it soon.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <FieldLabel>Email</FieldLabel>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button type="submit" disabled={pending} className={primaryButtonClass}>
            {pending ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
