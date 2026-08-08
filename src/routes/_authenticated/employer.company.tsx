import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { inputClass } from "@/components/auth-shell";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-vryanta";

export const Route = createFileRoute("/_authenticated/employer/company")({
  head: () => ({
    meta: [
      { title: "Company profile — Vryanta" },
      { name: "description", content: "Keep your organisation details current for candidates." },
      { property: "og:title", content: "Company profile — Vryanta" },
      { property: "og:description", content: "Keep your organisation details current for candidates." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CompanyProfile,
});

function CompanyProfile() {
  const { data: profile, userId } = useProfile();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ company_name: "", company_type: "", company_website: "", location: "", about: "", phone: "" });

  useEffect(() => {
    if (!profile) return;
    setForm({
      company_name: profile.company_name ?? "",
      company_type: profile.company_type ?? "",
      company_website: profile.company_website ?? "",
      location: profile.location ?? "",
      about: profile.about ?? "",
      phone: profile.phone ?? "",
    });
  }, [profile]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!userId) return;
    const { error } = await supabase.from("profiles").update(form).eq("id", userId);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Company profile saved.");
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Company profile" description="Shown to candidates on every vacancy you post." />
      <form onSubmit={save} className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        <input className={inputClass} placeholder="Company name" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
        <input className={inputClass} placeholder="Company type" value={form.company_type} onChange={(e) => setForm({ ...form, company_type: e.target.value })} />
        <input className={inputClass} placeholder="Website" value={form.company_website} onChange={(e) => setForm({ ...form, company_website: e.target.value })} />
        <input className={inputClass} placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <input className={inputClass} placeholder="Contact phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <textarea rows={4} className={`${inputClass} sm:col-span-2`} placeholder="About the organisation" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
        <button type="submit" className="w-fit rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Save company profile
        </button>
      </form>
    </div>
  );
}
