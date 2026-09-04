import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { inputClass } from "@/components/auth-shell";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useResumeSections } from "@/hooks/use-vryanta";
import { notify } from "@/lib/notifications";
import {
  experienceBands,
  interestOptions,
  jobTypeOptions,
  workModeOptions,
} from "@/lib/matching";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Set up your Vryanta profile" },
      { name: "description", content: "Five quick steps so Vryanta can match you with relevant opportunities." },
      { property: "og:title", content: "Set up your Vryanta profile" },
      { property: "og:description", content: "Tell Vryanta about your education, skills and interests." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Onboarding,
});

const TOTAL = 5;

type Form = {
  full_name: string;
  headline: string;
  location: string;
  phone: string;
  degree: string;
  institution: string;
  field: string;
  end_year: string;
  grade: string;
  skills: string;
  languages: string;
  interests: string[];
  experience_level: string;
  desired_titles: string;
  preferred_locations: string;
  job_types: string[];
  work_modes: string[];
  expected_salary: string;
};

const empty: Form = {
  full_name: "",
  headline: "",
  location: "",
  phone: "",
  degree: "",
  institution: "",
  field: "",
  end_year: "",
  grade: "",
  skills: "",
  languages: "",
  interests: [],
  experience_level: "Fresher",
  desired_titles: "",
  preferred_locations: "",
  job_types: [],
  work_modes: [],
  expected_salary: "",
};

const list = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean);

function Onboarding() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: profile, userId } = useProfile();
  const { data: sections } = useResumeSections();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form>(empty);

  useEffect(() => {
    if (!profile) return;
    setForm((prev) => ({
      ...prev,
      full_name: prev.full_name || profile.full_name || "",
      headline: prev.headline || profile.headline || "",
      location: prev.location || profile.location || "",
      phone: prev.phone || profile.phone || "",
      skills: prev.skills || (profile.skills ?? []).join(", "),
      interests: prev.interests.length ? prev.interests : (profile.interests ?? []),
      experience_level: profile.experience_level || prev.experience_level,
      desired_titles: prev.desired_titles || (profile.desired_titles ?? []).join(", "),
      preferred_locations: prev.preferred_locations || (profile.preferred_locations ?? []).join(", "),
      job_types: prev.job_types.length ? prev.job_types : (profile.job_types ?? []),
      work_modes: prev.work_modes.length ? prev.work_modes : (profile.work_modes ?? []),
      expected_salary: prev.expected_salary || profile.expected_salary || "",
    }));
  }, [profile]);

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((prev) => ({ ...prev, [key]: value }));
  const toggle = (key: "interests" | "job_types" | "work_modes", value: string) =>
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((item) => item !== value) : [...prev[key], value],
    }));

  async function finish() {
    if (!userId) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim(),
        headline: form.headline.trim() || null,
        location: form.location.trim() || null,
        phone: form.phone.trim() || null,
        skills: list(form.skills),
        languages: list(form.languages),
        interests: form.interests,
        experience_level: form.experience_level,
        desired_titles: list(form.desired_titles),
        preferred_locations: list(form.preferred_locations),
        job_types: form.job_types,
        work_modes: form.work_modes,
        expected_salary: form.expected_salary.trim() || null,
        is_fresher: form.experience_level !== "Experienced",
        onboarding_completed: true,
      })
      .eq("id", userId);

    if (error) {
      setSaving(false);
      toast.error(error.message);
      return;
    }

    const hasEducation = (sections?.education.length ?? 0) > 0;
    if (!hasEducation && form.degree.trim() && form.institution.trim()) {
      const { error: eduError } = await supabase.from("education").insert({
        user_id: userId,
        degree: form.degree.trim(),
        institution: form.institution.trim(),
        field: form.field.trim() || null,
        end_year: form.end_year.trim() || null,
        grade: form.grade.trim() || null,
      });
      if (eduError) toast.error(eduError.message);
    }

    await notify(userId, {
      title: "Your Vryanta profile is ready",
      body: "We're using your education, skills and interests to rank opportunities for you.",
      kind: "profile",
      link: "/dashboard",
    });

    setSaving(false);
    await queryClient.invalidateQueries();
    toast.success("Your Vryanta profile is ready.");
    navigate({ to: "/dashboard" });
  }

  async function skip() {
    if (userId) await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", userId);
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent">
            Step {step} / {TOTAL}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {["Basic information", "Education", "Skills", "Career interests", "Career preferences"][step - 1]}
          </h1>
        </div>
        <button type="button" onClick={skip} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Skip for now
        </button>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-accent fluid duration-300" style={{ width: `${(step / TOTAL) * 100}%` }} />
      </div>

      <div className="mt-6 space-y-4 rounded-xl border border-border bg-card p-5 sm:p-6">
        {step === 1 ? (
          <>
            <Field label="Full name" value={form.full_name} onChange={(v) => set("full_name", v)} placeholder="Rahul Sharma" />
            <Field label="Headline" value={form.headline} onChange={(v) => set("headline", v)} placeholder="B.Com graduate | Accounts & finance" />
            <Field label="Current location" value={form.location} onChange={(v) => set("location", v)} placeholder="Pune, Maharashtra" />
            <Field label="Phone (optional)" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+91…" />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <p className="text-sm text-muted-foreground">
              Add your highest or most recent qualification. You can add more later from your profile.
            </p>
            <Field label="Degree / qualification" value={form.degree} onChange={(v) => set("degree", v)} placeholder="B.Sc. Statistics" />
            <Field label="Institution" value={form.institution} onChange={(v) => set("institution", v)} placeholder="Savitribai Phule Pune University" />
            <Field label="Course / stream" value={form.field} onChange={(v) => set("field", v)} placeholder="Statistics" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Completion year" value={form.end_year} onChange={(v) => set("end_year", v)} placeholder="2025" />
              <Field label="Grade / percentage" value={form.grade} onChange={(v) => set("grade", v)} placeholder="8.1 CGPA" />
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <Field
              label="Skills (comma separated)"
              value={form.skills}
              onChange={(v) => set("skills", v)}
              placeholder="Excel, Tally, communication, Python"
            />
            <Field
              label="Languages (comma separated)"
              value={form.languages}
              onChange={(v) => set("languages", v)}
              placeholder="English, Hindi, Marathi"
            />
            <div>
              <span className="text-sm font-medium">Experience level</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {experienceBands.map((band) => (
                  <Chip
                    key={band}
                    label={band}
                    active={form.experience_level === band}
                    onClick={() => set("experience_level", band)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <p className="text-sm text-muted-foreground">
              Pick the fields you want to work in. Vryanta uses these to rank opportunities.
            </p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  active={form.interests.includes(interest)}
                  onClick={() => toggle("interests", interest)}
                />
              ))}
            </div>
          </>
        ) : null}

        {step === 5 ? (
          <>
            <Field
              label="Roles you're looking for (comma separated)"
              value={form.desired_titles}
              onChange={(v) => set("desired_titles", v)}
              placeholder="Accounts assistant, finance intern"
            />
            <Field
              label="Preferred locations (comma separated)"
              value={form.preferred_locations}
              onChange={(v) => set("preferred_locations", v)}
              placeholder="Pune, Mumbai, Remote"
            />
            <div>
              <span className="text-sm font-medium">Work type</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {jobTypeOptions.map((type) => (
                  <Chip key={type} label={type} active={form.job_types.includes(type)} onClick={() => toggle("job_types", type)} />
                ))}
              </div>
            </div>
            <div>
              <span className="text-sm font-medium">Work mode</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {workModeOptions.map((mode) => (
                  <Chip key={mode} label={mode} active={form.work_modes.includes(mode)} onClick={() => toggle("work_modes", mode)} />
                ))}
              </div>
            </div>
            <Field
              label="Expected stipend / salary (optional)"
              value={form.expected_salary}
              onChange={(v) => set("expected_salary", v)}
              placeholder="₹15,000 / month"
            />
          </>
        ) : null}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2.5 text-sm font-semibold fluid hover:bg-secondary disabled:opacity-40"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        {step < TOTAL ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(TOTAL, s + 1))}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground fluid hover:scale-[1.02]"
          >
            Continue <ArrowRight className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={finish}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground fluid hover:scale-[1.02] disabled:opacity-60"
          >
            <Check className="size-4" /> {saving ? "Saving…" : "Finish setup"}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={inputClass} />
    </label>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm font-medium fluid hover:scale-[1.03]",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary",
      )}
    >
      {label}
    </button>
  );
}
