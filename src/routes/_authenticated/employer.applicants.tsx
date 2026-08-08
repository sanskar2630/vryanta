import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-vryanta";

export const Route = createFileRoute("/_authenticated/employer/applicants")({
  head: () => ({
    meta: [
      { title: "Applicants — Vryanta" },
      { name: "description", content: "Review candidates who applied to your vacancies." },
      { property: "og:title", content: "Applicants — Vryanta" },
      { property: "og:description", content: "Review candidates who applied to your vacancies." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Applicants,
});

const statuses = ["Under Review", "Shortlisted", "Interview", "Rejected", "Hired"];

function Applicants() {
  const { userId } = useProfile();
  const queryClient = useQueryClient();
  const { data: rows = [] } = useQuery({
    queryKey: ["employer-applicants", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data: jobs, error: jobsError } = await supabase.from("jobs").select("id").eq("employer_id", userId!);
      if (jobsError) throw jobsError;
      const ids = (jobs ?? []).map((job) => job.id);
      if (ids.length === 0) return [];
      const { data, error } = await supabase.from("applications").select("*").in("job_id", ids).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("applications").update({ status }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Status updated.");
    await queryClient.invalidateQueries({ queryKey: ["employer-applicants"] });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Applicants" description="Candidates who applied to your roles, ranked by match score." />
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No applicants yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li key={row.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-5">
              <div>
                <p className="font-semibold">{row.job_title}</p>
                <p className="text-sm text-muted-foreground">{row.match_score}% match · applied {new Date(row.created_at).toLocaleDateString()}</p>
              </div>
              <select
                value={row.status}
                onChange={(event) => setStatus(row.id, event.target.value)}
                className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
