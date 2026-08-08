import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { inputClass } from "@/components/auth-shell";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-vryanta";
import { categories } from "@/data/jobs";

export const Route = createFileRoute("/_authenticated/employer/post-job")({
  head: () => ({
    meta: [
      { title: "Post a vacancy — Vryanta" },
      { name: "description", content: "Publish a paid or unpaid opportunity for students and scholars." },
      { property: "og:title", content: "Post a vacancy — Vryanta" },
      { property: "og:description", content: "Publish a paid or unpaid opportunity for students and scholars." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PostJob,
});

function PostJob() {
  const { data: profile, userId } = useProfile();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: categories[0]?.slug ?? "",
    location: "",
    job_type: "Full-time",
    stipend: "",
    qualification: "",
    summary: "",
  });

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!userId) return;
    const { error } = await supabase.from("jobs").insert({
      employer_id: userId,
      company: profile?.company_name || profile?.full_name || "Employer",
      ...form,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Vacancy published.");
    navigate({ to: "/employer/jobs" });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Post a vacancy" description="Free to post. Visible to every Vryanta job seeker." />
      <form onSubmit={submit} className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        <input required className={inputClass} placeholder="Role title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <input required className={inputClass} placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <select className={inputClass} value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })}>
          {["Full-time", "Part-time", "Internship", "Contract", "Remote"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input className={inputClass} placeholder="Stipend / salary" value={form.stipend} onChange={(e) => setForm({ ...form, stipend: e.target.value })} />
        <input className={inputClass} placeholder="Required qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
        <textarea rows={4} className={`${inputClass} sm:col-span-2`} placeholder="Role summary" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
        <button type="submit" className="w-fit rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Publish vacancy
        </button>
      </form>
    </div>
  );
}
