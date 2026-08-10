import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { BellOff, Check } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/hooks/use-vryanta";
import { timeAgo } from "@/lib/notifications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Vryanta" },
      { name: "description", content: "Updates about your applications, matches and profile." },
      { property: "og:title", content: "Notifications — Vryanta" },
      { property: "og:description", content: "Updates about your applications, matches and profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { data: rows = [], unread, userId } = useNotifications();
  const queryClient = useQueryClient();

  async function markAllRead() {
    if (!userId) return;
    await supabase.from("notifications").update({ is_read: true }).eq("user_id", userId).eq("is_read", false);
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="In-app updates only — Vryanta does not send email or push notifications yet."
        action={
          unread > 0 ? (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-2 rounded-lg border border-input px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              <Check className="size-4" /> Mark all as read
            </button>
          ) : null
        }
      />

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <BellOff className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Nothing yet. Apply to an opportunity or finish your profile and updates will appear here.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.id}
              className={cn(
                "rounded-xl border bg-card p-5 transition-colors",
                row.is_read ? "border-border" : "border-accent/50",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">{row.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(row.created_at)}</span>
              </div>
              {row.body ? <p className="mt-1 text-sm text-muted-foreground">{row.body}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
