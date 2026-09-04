import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, Bookmark, Briefcase, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Reveal } from "@/components/motion";
import { DemoBadge, EmptyState, PrototypeNote } from "@/components/prototype";
import {
  useAllJobs,
  useApplications,
  useNotifications,
  useProfile,
  useResumeSections,
  useSavedJobs,
} from "@/hooks/use-vryanta";
import { greetingFor, profileCompletion } from "@/lib/vryanta";
import { matchDetails } from "@/lib/matching";
import { timeAgo } from "@/lib/notifications";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Vryanta dashboard" },
      { name: "description", content: "Personalised job matches, applications and profile progress." },
      { property: "og:title", content: "Your Vryanta dashboard" },
      { property: "og:description", content: "Personalised job matches based on your profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: profile } = useProfile();
  const { data: sections } = useResumeSections();
  const { data: jobs = [] } = useAllJobs();
  const { data: applications = [] } = useApplications();
  const { data: saved = [] } = useSavedJobs();
  const { data: notifications = [] } = useNotifications();

  const completion = profileCompletion({
    profile: profile ?? null,
    educationCount: sections?.education.length ?? 0,
    experienceCount: sections?.experience.length ?? 0,
    certificationCount: sections?.certifications.length ?? 0,
  });

  const appliedRefs = new Set(applications.map((row) => row.job_ref));
  const ranked = jobs
    .map((job) => ({ job, match: matchDetails(profile, job) }))
    .sort((a, b) => b.match.score - a.match.score);
  const recommendations = ranked.filter(({ job }) => !appliedRefs.has(job.ref)).slice(0, 6);
  const missing = completion.items.filter((item) => !item.done).slice(0, 3);
  const firstName = (profile?.full_name || "there").split(" ")[0];
  const activeApplications = applications.filter((row) => !["Rejected", "Hired"].includes(row.status)).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${greetingFor()}, ${firstName}.`}
        description={
          completion.percent < 100
            ? "Your matches sharpen as your profile fills in — the rest is ranked from what you've shared so far."
            : "Your profile is complete. Here's what fits you best right now."
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active applications" value={activeApplications} to="/applications" icon={Briefcase} />
        <Stat label="Saved opportunities" value={saved.length} to="/saved" icon={Bookmark} />
        <Stat label="Profile complete" value={`${completion.percent}%`} to="/profile" icon={Sparkles} />
        <Stat label="Updates" value={notifications.filter((row) => !row.is_read).length} to="/notifications" icon={Bell} />
      </div>

      {completion.percent < 100 ? (
        <Reveal>
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-semibold">Profile {completion.percent}% complete</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Matching uses your education, skills, interests and preferences — nothing else.
                </p>
              </div>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
              >
                Complete profile <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700"
                style={{ width: `${completion.percent}%` }}
              />
            </div>
            {missing.length > 0 ? (
              <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                {missing.map((item) => (
                  <li key={item.label} className="rounded-lg border border-dashed border-border px-3 py-2">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.hint}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        </Reveal>
      ) : null}

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-semibold">Recommended for you</h2>
          <Link to="/find-jobs" className="text-sm font-semibold text-accent hover:underline">
            Browse all
          </Link>
        </div>
        {recommendations.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No new recommendations yet"
              description="You've seen everything currently listed. Set up a job alert and we'll flag new matches here."
              action={
                <Link
                  to="/alerts"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Create a job alert
                </Link>
              }
            />
          </div>

        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map(({ job, match }, index) => (
              <Reveal key={job.ref} delay={Math.min(index, 6) * 40} className="h-full">
                <article className="flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/60">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
                      {match.score}% Match
                    </span>
                    {!job.jobId ? <DemoBadge /> : null}
                  </div>
                  <h3 className="mt-3 text-base font-semibold leading-snug">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {job.location} · {job.type}
                  </p>
                  <p className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                    <Sparkles className="mt-0.5 size-3.5 shrink-0 text-accent" />
                    <span>{match.summary}</span>
                  </p>
                  <Link
                    to="/find-jobs"
                    className="mt-auto rounded-lg border border-input px-3 py-2 text-center text-sm font-semibold transition-colors hover:bg-secondary"
                  >
                    View &amp; apply
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Recent applications</h2>
          {applications.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              You haven't applied to anything yet. Applications you send appear here with their status.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {applications.slice(0, 4).map((row) => (
                <li key={row.id} className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-semibold">{row.job_title}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.company} · {timeAgo(row.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-xs">{row.status}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/applications" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
            Track all applications
          </Link>
        </section>

        <section className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-semibold">Latest updates</h2>
          {notifications.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Updates about your applications and profile will show up here.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {notifications.slice(0, 4).map((row) => (
                <li key={row.id} className="border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-semibold">{row.title}</p>
                  <p className="text-xs text-muted-foreground">{timeAgo(row.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
          <Link to="/notifications" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
            See all updates
          </Link>
        </section>
      </div>

      <PrototypeNote>
        Vryanta is an early prototype. Some opportunities are curated examples for demonstration, match scores are
        rule-based (not AI), and notifications are in-app only.
      </PrototypeNote>
    </div>
  );
}

function Stat({
  label,
  value,
  to,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  to: "/applications" | "/saved" | "/profile" | "/notifications";
  icon: typeof Bell;
}) {
  return (
    <Link
      to={to}
      className="rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="size-4 text-accent" />
      </div>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </Link>
  );
}
