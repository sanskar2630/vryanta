import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Building2, GraduationCap, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell, FieldLabel, inputClass, primaryButtonClass } from "@/components/auth-shell";
import { GoogleButton } from "@/components/google-button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/signup")({
  head: () => ({
    meta: [
      { title: "Create your Vryanta account" },
      {
        name: "description",
        content: "Build your profile and discover jobs you're qualified for. Free for students, scholars and employers.",
      },
      { property: "og:title", content: "Create your Vryanta account" },
      { property: "og:description", content: "Build your profile and discover jobs you're qualified for." },
    ],
  }),
  component: SignupPage,
});

type AccountType = "job_seeker" | "employer";

function SignupPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<AccountType>("job_seeker");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirm: "",
    companyName: "",
    companyType: "",
    location: "",
  });

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

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
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback",
        data: {
          full_name: form.fullName.trim(),
          account_type: accountType,
          company_name: accountType === "employer" ? form.companyName.trim() : null,
          company_type: accountType === "employer" ? form.companyType.trim() : null,
          location: form.location.trim() || null,
        },
      },
    });
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) {
      setSentTo(form.email.trim());
      return;
    }
    toast.success("Account created. Let's build your profile.");
    navigate({ to: accountType === "employer" ? "/employer" : "/dashboard" });
  }

  if (sentTo) {
    return (
      <AuthShell
        title="Confirm your email"
        subtitle={`We sent a confirmation link to ${sentTo}. Click it to activate your Vryanta account.`}
        footer={
          <Link to="/auth/login" className="font-semibold text-accent hover:underline">
            Back to log in
          </Link>
        }
      >
        <div className="flex items-start gap-3 rounded-lg border border-border bg-secondary/60 p-4 text-sm text-muted-foreground">
          <Mail className="mt-0.5 size-4 shrink-0 text-accent" />
          <p>Didn't get it? Check your spam folder, then try signing up again with the same email.</p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title={accountType === "employer" ? "Create an employer account" : "Create your Vryanta account"}
      subtitle={
        accountType === "employer"
          ? "Post vacancies and reach students and scholars actively looking for work."
          : "Build your profile and discover jobs you're qualified for."
      }
      footer={
        <>
          Already have an account?{" "}
          <Link to="/auth/login" className="font-semibold text-accent hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-border p-1">
        {(
          [
            { value: "job_seeker" as const, label: "Job seeker", icon: GraduationCap },
            { value: "employer" as const, label: "Employer", icon: Building2 },
          ]
        ).map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setAccountType(option.value)}
              className={cn(
                "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                accountType === option.value ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
              )}
            >
              <Icon className="size-4" />
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <GoogleButton />
      </div>

      {!showEmailForm ? (
        <>
          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
          <button
            type="button"
            onClick={() => setShowEmailForm(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            <Mail className="size-4" />
            Continue with Email
          </button>
        </>
      ) : (
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="block">
            <FieldLabel>Full name</FieldLabel>
            <input required value={form.fullName} onChange={update("fullName")} className={inputClass} placeholder="Rahul Sharma" />
          </label>

          {accountType === "employer" ? (
            <>
              <label className="block">
                <FieldLabel>Company name</FieldLabel>
                <input required value={form.companyName} onChange={update("companyName")} className={inputClass} placeholder="ABC Technologies" />
              </label>
              <label className="block">
                <FieldLabel>Company type</FieldLabel>
                <input value={form.companyType} onChange={update("companyType")} className={inputClass} placeholder="College, startup, NGO…" />
              </label>
            </>
          ) : null}

          <label className="block">
            <FieldLabel>{accountType === "employer" ? "Work email" : "Email"}</FieldLabel>
            <input type="email" required value={form.email} onChange={update("email")} className={inputClass} placeholder="you@example.com" />
          </label>

          <label className="block">
            <FieldLabel>Location</FieldLabel>
            <input value={form.location} onChange={update("location")} className={inputClass} placeholder="Pune, Maharashtra" />
          </label>

          <label className="block">
            <FieldLabel>Password</FieldLabel>
            <input type="password" required autoComplete="new-password" value={form.password} onChange={update("password")} className={inputClass} placeholder="At least 8 characters" />
          </label>

          <label className="block">
            <FieldLabel>Confirm password</FieldLabel>
            <input type="password" required autoComplete="new-password" value={form.confirm} onChange={update("confirm")} className={inputClass} placeholder="Repeat your password" />
          </label>

          <button type="submit" disabled={pending} className={primaryButtonClass}>
            {pending ? "Creating account…" : "Create Account"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
