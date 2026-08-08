import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-vryanta";

export const Route = createFileRoute("/_authenticated/employer/jobs")({
  head: () => ({
    meta: [
      { title: "My vacancies — Vryanta" },
      { name: "description", content: "Manage the roles your organisation posted." },
      { property: "og:title", content: "My vacancies — Vryanta" },
      { property: "og:description", content: "Manage the roles your organisation posted." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EmployerJobs,
});

function EmployerJobs() {
  const { userId } = useProfile();
  const queryClient = useQueryClient();
  const { data: jobs = [] } = useQuery({
    queryKey: ["employer-jobs", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select("*").eq("employer_id", userId!).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function close(id: string) {
    const { error } = await supabase.from("jobs").update({ status: "closed" }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Vacancy closed.");
    await queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My vacancies" description="Open and closed roles you posted." />
      {jobs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          You haven't posted a vacancy yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {jobs.map((job) => (
            <li key={job.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-5">
              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-muted-foreground">{job.location} · {job.job_type} · {job.status}</p>
              </div>
              {job.status === "open" ? (
                <button type="button" onClick={() => close(job.id)} className="text-sm font-semibold text-destructive hover:underline">
                  Close vacancy
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
