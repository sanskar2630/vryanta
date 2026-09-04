import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Bookmark, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Reveal } from "@/components/motion";
import { DemoBadge } from "@/components/prototype";
import { supabase } from "@/integrations/supabase/client";
import { useAllJobs, useApplications, useProfile, useSavedJobs } from "@/hooks/use-vryanta";
import { categories } from "@/data/jobs";
import { notify } from "@/lib/notifications";
import {
  experienceBand,
  experienceBands,
  jobTypeOptions,
  matchDetails,
  workModeOptions,
} from "@/lib/matching";
import { cn } from "@/lib/utils";

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

type SortKey = "match" | "recent" | "title";

function FindJobs() {
  const { data: profile, userId } = useProfile();
  const { data: jobs = [] } = useAllJobs();
  const { data: saved = [] } = useSavedJobs();
  const { data: applications = [] } = useApplications();
  const queryClient = useQueryClient();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState<SortKey>("match");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const savedRefs = new Set(saved.map((row) => row.job_ref));
  const appliedRefs = new Set(applications.map((row) => row.job_ref));

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const city = location.trim().toLowerCase();
    const rows = jobs
      .filter((job) => {
        if (category && job.category !== category) return false;
        if (jobType && job.type !== jobType) return false;
        if (workMode && job.workMode !== workMode) return false;
        if (level && experienceBand(job) !== level) return false;
        if (city && !job.location.toLowerCase().includes(city)) return false;
        if (
          needle &&
          !`${job.title} ${job.company} ${job.location} ${job.qualification} ${job.skills.join(" ")}`
            .toLowerCase()
            .includes(needle)
        )
          return false;
        return true;
      })
      .map((job) => ({ job, match: matchDetails(profile, job) }));

    if (sort === "title") return rows.sort((a, b) => a.job.title.localeCompare(b.job.title));
    if (sort === "recent") return rows.sort((a, b) => (a.job.jobId ? -1 : 1) - (b.job.jobId ? -1 : 1));
    return rows.sort((a, b) => b.match.score - a.match.score);
  }, [jobs, category, query, profile, location, jobType, workMode, level, sort]);

  const activeFilters = [category, location, jobType, workMode, level].filter(Boolean).length;

  function resetFilters() {
    setCategory("");
    setLocation("");
    setJobType("");
    setWorkMode("");
    setLevel("");
  }

  async function toggleSave(job: (typeof results)[number]["job"]) {
    if (!userId) return;
    if (savedRefs.has(job.ref)) {
      await supabase.from("saved_jobs").delete().eq("user_id", userId).eq("job_ref", job.ref);
      toast.success("Removed from saved jobs.");
    } else {
      const { error } = await supabase.from("saved_jobs").insert({
        user_id: userId,
        job_ref: job.ref,
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
    await notify(userId, {
      title: `Application submitted — ${job.title}`,
      body: `${job.company} · ${job.location}. Track the status under Applications.`,
      kind: "application",
      link: "/applications",
    });
    toast.success("Application sent. Track it under Applications.");
    await queryClient.invalidateQueries({ queryKey: ["applications"] });
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find opportunities"
        description={`${results.length} of ${jobs.length} opportunities, ranked by how well they fit your profile.`}
      />

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-1 items-center gap-3 rounded-lg border border-input bg-card px-4 py-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by role, company, skill or qualification"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-input px-4 py-3 text-sm font-semibold fluid hover:bg-secondary"
          >
            <SlidersHorizontal className="size-4" />
            Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
          </button>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            aria-label="Sort opportunities"
            className="rounded-lg border border-input bg-card px-4 py-3 text-sm outline-none"
          >
            <option value="match">Best match</option>
            <option value="recent">Newest first</option>
            <option value="title">A–Z</option>
          </select>
        </div>

        {filtersOpen ? (
          <div className="space-y-4 rounded-xl border border-border bg-card p-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Location</span>
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Pune, Remote…"
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Experience level</span>
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none"
                >
                  <option value="">Any</option>
                  {experienceBands.map((band) => (
                    <option key={band} value={band}>
                      {band}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <FilterRow label="Work type" options={jobTypeOptions} value={jobType} onChange={setJobType} />
            <FilterRow label="Work mode" options={workModeOptions} value={workMode} onChange={setWorkMode} />
            {activeFilters > 0 ? (
              <button type="button" onClick={resetFilters} className="text-sm font-semibold text-accent hover:underline">
                Clear all filters
              </button>
            ) : null}
          </div>
        ) : null}

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <Chip active={!category} onClick={() => setCategory("")} label="All" />
          {categories.map((item) => (
            <Chip key={item.slug} active={category === item.slug} onClick={() => setCategory(item.slug)} label={item.name} />
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <p className="font-semibold">No opportunities match these filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try widening the location or clearing a filter — the opportunity pool is still small in this prototype.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(({ job, match }, index) => (
            <Reveal key={job.ref} delay={Math.min(index, 6) * 40} className="h-full">
              <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 fluid duration-300 hover:-translate-y-0.5 hover:border-accent/60">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
                    {match.score}% Match
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSave(job)}
                    aria-label={savedRefs.has(job.ref) ? "Remove from saved" : "Save job"}
                    className="text-muted-foreground fluid hover:text-accent"
                  >
                    <Bookmark className={savedRefs.has(job.ref) ? "size-5 fill-accent text-accent" : "size-5"} />
                  </button>
                </div>
                <h3 className="mt-3 text-base font-semibold leading-snug">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {job.location} · {job.type} · {job.stipend}
                </p>
                <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                  <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent" />
                  <span>{match.summary}</span>
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                    {experienceBand(job)}
                  </span>
                  {!job.jobId ? <DemoBadge /> : null}
                </div>
                <button
                  type="button"
                  disabled={appliedRefs.has(job.ref)}
                  onClick={() => apply(job, match.score)}
                  className="mt-auto w-full rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground fluid hover:scale-[1.01] disabled:opacity-50"
                  
                >
                  {appliedRefs.has(job.ref) ? "Applied" : "Apply now"}
                </button>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="mt-2 flex flex-wrap gap-2">
        <Chip label="Any" active={!value} onClick={() => onChange("")} />
        {options.map((option) => (
          <Chip key={option} label={option} active={value === option} onClick={() => onChange(value === option ? "" : option)} />
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
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium fluid hover:scale-[1.03]",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary",
      )}
    >
      {label}
    </button>
  );
}
