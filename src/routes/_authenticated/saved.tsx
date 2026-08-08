import { createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useSavedJobs } from "@/hooks/use-vryanta";

export const Route = createFileRoute("/_authenticated/saved")({
  head: () => ({
    meta: [
      { title: "Saved jobs — Vryanta" },
      { name: "description", content: "The vacancies you bookmarked on Vryanta." },
      { property: "og:title", content: "Saved jobs — Vryanta" },
      { property: "og:description", content: "The vacancies you bookmarked on Vryanta." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SavedPage,
});

function SavedPage() {
  const { data: saved = [] } = useSavedJobs();
  const { userId } = useProfile();
  const queryClient = useQueryClient();

  async function remove(id: string) {
    if (!userId) return;
    await supabase.from("saved_jobs").delete().eq("id", id).eq("user_id", userId);
    toast.success("Removed from saved jobs.");
    await queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Saved Jobs" description="Only you can see the jobs you saved." />
      {saved.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nothing saved yet. Tap the bookmark icon on any job to keep it here.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((row) => (
            <li key={row.id} className="rounded-xl border border-border bg-card p-5">
              <p className="font-semibold">{row.job_title}</p>
              <p className="text-sm text-muted-foreground">{row.company}</p>
              <p className="mt-1 text-sm text-muted-foreground">{row.location}</p>
              <button
                type="button"
                onClick={() => remove(row.id)}
                className="mt-4 w-full rounded-lg border border-input px-3 py-2 text-sm font-semibold hover:bg-secondary"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
