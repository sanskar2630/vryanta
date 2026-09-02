import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, primaryButtonClass } from "@/components/auth-shell";

export const Route = createFileRoute("/auth/verify-email")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Confirm your email — Vryanta" },
      { name: "description", content: "Confirm your email address to activate your Vryanta account." },
      { property: "og:title", content: "Confirm your email — Vryanta" },
      { property: "og:description", content: "Confirm your email address to activate your Vryanta account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate({ to: "/auth/login", replace: true });
        return;
      }
      if (data.user.email_confirmed_at) {
        navigate({ to: "/dashboard", replace: true });
        return;
      }
      setEmail(data.user.email ?? null);
    });
  }, [navigate]);

  async function resend() {
    if (!email) return;
    setPending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin + "/auth/callback" },
    });
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Confirmation email sent.");
  }

  async function useAnotherAccount() {
    await supabase.auth.signOut();
    navigate({ to: "/auth/login", replace: true });
  }

  return (
    <AuthShell
      title="Confirm your email"
      subtitle={
        email
          ? `We sent a confirmation link to ${email}. Click it to unlock your Vryanta dashboard.`
          : "Click the confirmation link we emailed you to unlock your Vryanta dashboard."
      }
      footer={
        <button type="button" onClick={useAnotherAccount} className="font-semibold text-accent hover:underline">
          Use a different account
        </button>
      }
    >
      <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/60 p-4 text-sm text-muted-foreground">
        <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
        <p>Check your spam folder if it hasn't arrived. Already confirmed? Reload this page.</p>
      </div>

      <button type="button" onClick={resend} disabled={pending || !email} className={`${primaryButtonClass} mt-5`}>
        {pending ? "Sending…" : "Resend confirmation email"}
      </button>

      <p className="mt-4 text-center text-sm">
        <Link to="/" className="text-accent hover:underline">
          Back to home
        </Link>
      </p>
    </AuthShell>
  );
}
