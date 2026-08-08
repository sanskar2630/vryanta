import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-vryanta";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Vryanta" },
      { name: "description", content: "Manage notifications, visibility and your account." },
      { property: "og:title", content: "Settings — Vryanta" },
      { property: "og:description", content: "Manage notifications, visibility and your account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

const toggles = [
  { key: "notify_job_alerts", label: "Job alert emails" },
  { key: "notify_application_updates", label: "Application status updates" },
  { key: "notify_employer_messages", label: "Messages from employers" },
] as const;

function SettingsPage() {
  const { data: profile, userId } = useProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function update(patch: Record<string, boolean | string>) {
    if (!userId) return;
    const { error } = await supabase.from("profiles").update(patch as never).eq("id", userId);
    if (error) {
      toast.error(error.message);
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["profile"] });
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth/login", replace: true });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Notifications, privacy and account controls." />

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold">Notifications</h2>
        <ul className="mt-3 space-y-3 text-sm">
          {toggles.map((toggle) => (
            <li key={toggle.key} className="flex items-center justify-between gap-4">
              <span>{toggle.label}</span>
              <input
                type="checkbox"
                checked={Boolean(profile?.[toggle.key])}
                onChange={(event) => update({ [toggle.key]: event.target.checked })}
                className="size-4 accent-current"
              />
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold">Profile visibility</h2>
        <select
          value={profile?.visibility ?? "employers"}
          onChange={(event) => update({ visibility: event.target.value })}
          className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm"
        >
          <option value="employers">Visible to verified employers</option>
          <option value="private">Private — only visible to me</option>
        </select>
      </section>

      <section className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-semibold">Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">{profile?.email}</p>
        <button
          type="button"
          onClick={signOut}
          className="mt-4 rounded-lg border border-input px-4 py-2 text-sm font-semibold hover:bg-secondary"
        >
          Log out
        </button>
      </section>
    </div>
  );
}
