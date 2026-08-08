import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bookmark, Search } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { supabase } from "@/integrations/supabase/client";
import { useAllJobs, useApplications, useProfile, useSavedJobs } from "@/hooks/use-vryanta";
import { categories } from "@/data/jobs";
import { matchScore } from "@/lib/vryanta";

export const Route = createFileRoute("/_authenticated/find-jobs")({
  head: () => ({
    meta: [
      { title: "Find jobs — Vryanta" },
      { name: "description", content: "Search and apply to vacancies matched to your profile." },
      { property: "og:title", content: "Find jobs — Vryanta" },
      { property: "og:description", content: "Search and apply to vacancies matched to your profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FindJobs,
});

function FindJobs() {
  const { data: profile, userId } = useProfile();
  const { data: jobs = [] } = useAllJobs();
  const { data: saved = [] } = useSavedJobs();
  const { data: applications = [] } = useApplications();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");

  const savedRefs = new Set(saved.map((row) => row.job_ref));
  const appliedRefs = new Set(applications.map((row) => row.job_ref));

  const results = useMemo(
    () =>
      jobs
        .filter((job) => (!category || job.category === category) &&
          `${job.title} ${job.company} ${job.location} ${job.qualification}`.toLowerCase().includes(query.trim().toLowerCase()))
        .map((job) => ({ job, score: matchScore(profile, job) }))
        .sort((a, b) => b.score - a.score),
    [jobs, category, query, profile],
  );

  async function toggleSave(ref: string, job: (typeof results)[number]["job"]) {
    if (!userId) return;
    if (savedRefs.has(ref)) {
      await supabase.from("saved_jobs").delete().eq("user_id", userId).eq("job_ref", ref);
      toast.success("Removed from saved jobs.");
    } else {
      const { error } = await supabase.from("saved_jobs").insert({
        user_id: userId,
        job_ref: ref,
        job_id: job.jobId,
        job_title: job.title,
        company: job.company,
        location: job.location,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Saved to your list.");
    }
    await queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
  }

  async function apply(job: (typeof results)[number]["job"], score: number) {
    if (!userId) return;
    const { error } = await supabase.from("applications").insert({
      user_id: userId,
      job_ref: job.ref,
      job_id: job.jobId,
      job_title: job.title,
      company: job.company,
      location: job.location,
      match_score: score,
      status: "Under Review",
    });
    if (error) {
      toast.error(error.message.includes("duplicate") ? "You already applied to this role." : error.message);
      return;
    }
    toast.success("Application sent. Track it under Applications.");
    await queryClient.invalidateQueries({ queryKey: ["applications"] });
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Find jobs" description={`${results.length} roles ranked by how well they match your profile.`} />

      <label className="flex items-center gap-3 rounded-lg border border-input bg-card px-4 py-3">
        <Search className="size-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by role, company, city or qualification"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        <Chip active={!category} onClick={() => setCategory("")} label="All" />
        {categories.map((item) => (
          <Chip key={item.slug} active={category === item.slug} onClick={() => setCategory(item.slug)} label={item.name} />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map(({ job, score }) => (
          <div key={job.ref} className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">{score}% Match</span>
              <button
                type="button"
                onClick={() => toggleSave(job.ref, job)}
                aria-label={savedRefs.has(job.ref) ? "Remove from saved" : "Save job"}
                className="text-muted-foreground transition-colors hover:text-accent"
              >
                <Bookmark className={savedRefs.has(job.ref) ? "size-5 fill-accent text-accent" : "size-5"} />
              </button>
            </div>
            <h3 className="mt-3 text-base font-semibold leading-snug">{job.title}</h3>
            <p className="text-sm text-muted-foreground">{job.company}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {job.location} · {job.type} · {job.stipend}
            </p>
            {job.summary ? <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{job.summary}</p> : null}
            <button
              type="button"
              disabled={appliedRefs.has(job.ref)}
              onClick={() => apply(job, score)}
              className="mt-4 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {appliedRefs.has(job.ref) ? "Applied" : "Apply now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"
      }`}
    >
      {label}
    </button>
  );
}
