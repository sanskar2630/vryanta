import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Cpu, GraduationCap, MapPin, Sparkles, UserRound } from "lucide-react";
import { Reveal, ScoreBar, ScoreRing, useInView } from "@/components/motion";
import { useAllJobs, useProfile } from "@/hooks/use-vryanta";
import { matchDetails } from "@/lib/matching";
import { curatedUnifiedJobs, type ScoreProfile } from "@/lib/vryanta";
import { cn } from "@/lib/utils";

/** Illustrative profile used when nobody is signed in. Clearly labelled in the UI. */
const demoProfile: Partial<ScoreProfile> = {
  skills: ["Python", "Data analysis", "Excel", "Communication", "Research"],
  desired_titles: ["Data Analyst", "Research Assistant"],
  preferred_locations: ["Pune", "Remote"],
  job_types: ["Internship", "Full-time"],
  work_modes: ["Remote", "On-site"],
  interests: ["Data & analytics", "Research"],
  experience_level: "Fresher",
  location: "Pune",
  headline: "B.Sc. Statistics graduate | Fresher",
};

type FlowProfile = {
  name: string;
  headline: string;
  location: string;
  skills: string[];
};

/**
 * The signature Vryanta visualisation: profile → skills → match engine →
 * ranked opportunities, with animated connectors and score reveals.
 * Uses the signed-in user's real profile when available, otherwise a labelled
 * example profile.
 */
export function MatchFlow({ className }: { className?: string }) {
  const { data: profile } = useProfile();
  const { data: liveJobs } = useAllJobs();
  const { ref, inView } = useInView<HTMLDivElement>();

  const isReal = Boolean(profile && (profile.skills?.length ?? 0) > 0);
  const scoreSource: Partial<ScoreProfile> = isReal ? (profile as ScoreProfile) : demoProfile;

  const flowProfile: FlowProfile = isReal
    ? {
        name: profile!.full_name || "Your profile",
        headline: profile!.headline || "Vryanta member",
        location: profile!.location || "Location not set",
        skills: (profile!.skills ?? []).slice(0, 5),
      }
    : {
        name: "Example seeker",
        headline: demoProfile.headline!,
        location: "Pune, Maharashtra",
        skills: demoProfile.skills!.slice(0, 5),
      };

  const jobs = liveJobs && liveJobs.length > 0 ? liveJobs : curatedUnifiedJobs;

  const ranked = useMemo(
    () =>
      jobs
        .map((job) => ({ job, match: matchDetails(scoreSource, job) }))
        .sort((a, b) => b.match.score - a.match.score)
        .slice(0, 3),
    [jobs, scoreSource],
  );

  const average = ranked.length
    ? Math.round(ranked.reduce((sum, item) => sum + item.match.score, 0) / ranked.length)
    : 0;

  return (
    <div ref={ref} className={cn("grid gap-4 lg:grid-cols-[0.9fr_auto_1.1fr] lg:items-center", className)}>
      {/* Stage 1 + 2: profile and skills */}
      <div className="space-y-3">
        <Reveal variant="right">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                <UserRound className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold">{flowProfile.name}</p>
                <p className="truncate text-xs text-muted-foreground">{flowProfile.headline}</p>
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-accent" />
              {flowProfile.location}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {flowProfile.skills.map((skill, index) => (
                <span
                  key={skill}
                  className="rounded-full border border-border bg-secondary/70 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground fluid"
                  style={{
                    opacity: inView ? 1 : 0,
                    transform: inView ? "none" : "translateY(6px)",
                    transitionDelay: `${180 + index * 90}ms`,
                    transitionDuration: "420ms",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <GraduationCap className="size-3.5 text-accent" />
              Qualifications + skills
            </p>
          </div>
        </Reveal>
      </div>

      {/* Stage 3: the engine */}
      <Reveal delay={120} className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 lg:flex-col">
          <Connector orientation="horizontal" active={inView} />
          <div className="glass-panel pulse-ring grid size-24 place-items-center rounded-full border border-border bg-card text-center">
            <div>
              <Cpu className="mx-auto size-4 text-accent" />
              <p className="mt-1 font-display text-lg font-semibold leading-none">{average}%</p>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">avg fit</p>
            </div>
          </div>
          <Connector orientation="horizontal" active={inView} />
          <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Match engine
          </p>
        </div>
      </Reveal>

      {/* Stage 4: ranked opportunities */}
      <div className="space-y-3">
        {ranked.map(({ job, match }, index) => (
          <Reveal key={job.ref} delay={220 + index * 110} variant="left">
            <div className="card-lift flex items-start gap-4 rounded-2xl border border-border bg-card p-4">
              <ScoreRing value={match.score} size={62} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold">{job.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {job.company} · {job.location}
                </p>
                <p className="mt-2 line-clamp-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="mt-0.5 size-3 shrink-0 text-accent" />
                  <span>{match.summary}</span>
                </p>
                <ScoreBar value={match.score} className="mt-2.5" />
              </div>
            </div>
          </Reveal>
        ))}
        <Reveal delay={520}>
          <p className="text-xs text-muted-foreground">
            {isReal ? (
              <>
                Ranked from your real profile.{" "}
                <Link to="/find-jobs" className="font-semibold text-accent hover:underline">
                  See all your matches
                </Link>
              </>
            ) : (
              <>
                Example profile and sample listings, shown to illustrate how matching works.{" "}
                <Link to="/auth/signup" className="font-semibold text-accent hover:underline">
                  Create a profile
                </Link>{" "}
                to see your own scores.
              </>
            )}
          </p>
        </Reveal>
      </div>
    </div>
  );
}

function Connector({ orientation, active }: { orientation: "horizontal" | "vertical"; active: boolean }) {
  const horizontal = orientation === "horizontal";
  return (
    <svg
      aria-hidden
      viewBox={horizontal ? "0 0 8 40" : "0 0 40 8"}
      className={horizontal ? "h-10 w-2" : "h-2 w-10"}
      preserveAspectRatio="none"
    >
      <line
        x1={horizontal ? 4 : 0}
        y1={horizontal ? 0 : 4}
        x2={horizontal ? 4 : 40}
        y2={horizontal ? 40 : 4}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={cn("text-accent/70", active && "flow-line")}
      />
    </svg>
  );
}
