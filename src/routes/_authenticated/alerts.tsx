import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { inputClass } from "@/components/auth-shell";
import { supabase } from "@/integrations/supabase/client";
import { useJobAlerts, useProfile } from "@/hooks/use-vryanta";
import { categories } from "@/data/jobs";

export const Route = createFileRoute("/_authenticated/alerts")({
  head: () => ({
    meta: [
      { title: "Job alerts — Vryanta" },
      { name: "description", content: "Create alerts and get notified about matching vacancies." },
      { property: "og:title", content: "Job alerts — Vryanta" },
      { property: "og:description", content: "Create alerts and get notified about matching vacancies." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AlertsPage,
});

function AlertsPage() {
  const { data: alerts = [] } = useJobAlerts();
  const { userId } = useProfile();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ label: "", keywords: "", category: "", location: "", frequency: "daily" });

  async function create(event: React.FormEvent) {
    event.preventDefault();
    if (!userId) return;
    const { error } = await supabase.from("job_alerts").insert({ user_id: userId, ...form });
    if (error) {
      toast.error(error.message);
      return;
    }
    setForm({ label: "", keywords: "", category: "", location: "", frequency: "daily" });
    toast.success("Alert created.");
    await queryClient.invalidateQueries({ queryKey: ["job-alerts"] });
  }

  async function remove(id: string) {
    if (!userId) return;
    await supabase.from("job_alerts").delete().eq("id", id).eq("user_id", userId);
    await queryClient.invalidateQueries({ queryKey: ["job-alerts"] });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Job Alerts" description="Tell Vryanta what to watch for and we'll keep an eye out." />

      <form onSubmit={create} className="grid gap-3 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        <input required className={inputClass} placeholder="Alert name" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
        <input className={inputClass} placeholder="Keywords (e.g. data entry)" value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} />
        <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">Any category</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <input className={inputClass} placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        <select className={inputClass} value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="instant">Instant</option>
        </select>
        <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Create alert
        </button>
      </form>

      <ul className="space-y-3">
        {alerts.map((alert) => (
          <li key={alert.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-5">
            <div>
              <p className="font-semibold">{alert.label}</p>
              <p className="text-sm text-muted-foreground">
                {[alert.keywords, alert.category, alert.location].filter(Boolean).join(" · ") || "Any role"} · {alert.frequency}
              </p>
            </div>
            <button type="button" onClick={() => remove(alert.id)} className="text-sm font-semibold text-destructive hover:underline">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
