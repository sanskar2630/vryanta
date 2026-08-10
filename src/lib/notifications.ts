import { supabase } from "@/integrations/supabase/client";

/**
 * In-app notifications only. Vryanta does not send email or push messages yet,
 * so nothing here should claim an external message was delivered.
 */
export type NotificationKind = "application" | "status" | "match" | "profile" | "system";

export type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  kind: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
};

export async function notify(
  userId: string,
  input: { title: string; body?: string; kind?: NotificationKind; link?: string },
) {
  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    title: input.title,
    body: input.body ?? null,
    kind: input.kind ?? "system",
    link: input.link ?? null,
  });
  // Notifications are secondary to the action that triggered them — never block it.
  if (error) console.warn("[vryanta] notification not stored:", error.message);
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
