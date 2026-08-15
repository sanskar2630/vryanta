import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { inputClass } from "@/components/auth-shell";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-vryanta";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — Vryanta" },
      { name: "description", content: "Build the resume-style profile that powers your job matches." },
      { property: "og:title", content: "Your profile — Vryanta" },
      { property: "og:description", content: "Build the resume-style profile that powers your job matches." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data: profile, userId } = useProfile();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    full_name: "",
    headline: "",
    phone: "",
    location: "",
    desired_titles: "",
    skills: "",
    languages: "",
    about: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    education: "",
    experience: "",
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      headline: profile.headline ?? "",
      phone: profile.phone ?? "",
      location: profile.location ?? "",
      desired_titles: (profile.desired_titles ?? []).join(", "),
      skills: (profile.skills ?? []).join(", "),
      languages: (Array.isArray(profile.languages) ? (profile.languages as string[]) : []).join(", "),
      about: profile.about ?? "",
      linkedin_url: ((profile as Record<string, unknown>).linkedin_url as string) ?? "",
      github_url: ((profile as Record<string, unknown>).github_url as string) ?? "",
      portfolio_url: ((profile as Record<string, unknown>).portfolio_url as string) ?? "",
      education: ((profile as Record<string, unknown>).education as string) ?? "",
      experience: ((profile as Record<string, unknown>).experience as string) ?? "",
    });
  }, [profile]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!userId) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        headline: form.headline,
        phone: form.phone,
        location: form.location,
        about: form.about,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        desired_titles: form.desired_titles.split(",").map((s) => s.trim()).filter(Boolean),
        languages: form.languages.split(",").map((s) => s.trim()).filter(Boolean),
        linkedin_url: form.linkedin_url,
        github_url: form.github_url,
        portfolio_url: form.portfolio_url,
        education: form.education,
        experience: form.experience,
      } as Record<string, unknown>)
      .eq("id", userId);

    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile updated.");
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Your profile" description="This information powers your match scores and digital resume." />
      <form onSubmit={save} className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <h2 className="text-base font-semibold">Basic Details</h2>
        </div>
        <Field label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
        <Field label="Headline" value={form.headline} onChange={(v) => setForm({ ...form, headline: v })} />
        <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
        <Field label="Desired job titles (comma separated)" value={form.desired_titles} onChange={(v) => setForm({ ...form, desired_titles: v })} />
        <Field label="Skills (comma separated)" value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} />
        <Field label="Languages (comma separated)" value={form.languages} onChange={(v) => setForm({ ...form, languages: v })} />
        
        <label className="sm:col-span-2">
          <span className="text-sm font-medium">About you</span>
          <textarea
            rows={3}
            value={form.about}
            onChange={(event) => setForm({ ...form, about: event.target.value })}
            className={`${inputClass} resize-y`}
          />
        </label>

        <div className="sm:col-span-2 border-t border-border pt-4 mt-2">
          <h2 className="text-base font-semibold">Background & Experience</h2>
        </div>
        <label className="sm:col-span-2">
          <span className="text-sm font-medium">Education & Qualifications</span>
          <textarea
            rows={2}
            placeholder="e.g. Bachelor of Science in Computer Science, University (2020 - 2024)"
            value={form.education}
            onChange={(event) => setForm({ ...form, education: event.target.value })}
            className={`${inputClass} resize-y`}
          />
        </label>
        <label className="sm:col-span-2">
          <span className="text-sm font-medium">Work Experience</span>
          <textarea
            rows={3}
            placeholder="e.g. Frontend Developer at TechCorp (2024 - Present)"
            value={form.experience}
            onChange={(event) => setForm({ ...form, experience: event.target.value })}
            className={`${inputClass} resize-y`}
          />
        </label>

        <div className="sm:col-span-2 border-t border-border pt-4 mt-2">
          <h2 className="text-base font-semibold">Professional Presence & Links</h2>
        </div>
        <Field label="LinkedIn Profile URL" value={form.linkedin_url} onChange={(v) => setForm({ ...form, linkedin_url: v })} />
        <Field label="GitHub Profile URL" value={form.github_url} onChange={(v) => setForm({ ...form, github_url: v })} />
        <Field label="Portfolio Website URL" value={form.portfolio_url} onChange={(v) => setForm({ ...form, portfolio_url: v })} />

        <div className="sm:col-span-2 pt-2">
          <button type="submit" className="w-fit rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Save profile
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
    </label>
  );
}
