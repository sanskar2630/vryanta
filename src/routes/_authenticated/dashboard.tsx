import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { useAllJobs, useApplications, useProfile, useResumeSections, useSavedJobs } from "@/hooks/use-vryanta";
import { greetingFor, matchScore, profileCompletion } from "@/lib/vryanta";

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

  const completion = profileCompletion({
    profile: profile ?? null,
    educationCount: sections?.education.length ?? 0,
    experienceCount: sections?.experience.length ?? 0,
    certificationCount: sections?.certifications.length ?? 0,
  });

  const recommendations = [...jobs]
    .map((job) => ({ job, score: matchScore(profile, job) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  const firstName = (profile?.full_name || "there").split(" ")[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${greetingFor()}, ${firstName}.`}
        description="Here are jobs matching your profile."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Applications" value={applications.length} to="/applications" />
        <Stat label="Saved jobs" value={saved.length} to="/saved" />
        <Stat label="Profile complete" value={`${completion.percent}%`} to="/profile" />
      </div>

      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-semibold">Profile {completion.percent}% complete</h2>
            <p className="mt-1 text-sm text-muted-foreground">A complete profile improves your job matches.</p>
          </div>
          <Link
            to="/profile"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Complete Profile
          </Link>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-accent" style={{ width: `${completion.percent}%` }} />
        </div>
        <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          {completion.items.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span className={item.done ? "text-accent" : "text-muted-foreground"}>{item.done ? "✓" : "○"}</span>
              <span className={item.done ? "" : "text-muted-foreground"}>{item.label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recommended for you</h2>
          <Link to="/find-jobs" className="text-sm font-semibold text-accent hover:underline">
            Find more jobs
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map(({ job, score }) => (
            <div key={job.ref} className="flex h-full flex-col rounded-xl border border-border bg-card p-5">
              <span className="w-fit rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
                {score}% Match
              </span>
              <h3 className="mt-3 text-base font-semibold leading-snug">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
              <p className="mt-2 text-sm text-muted-foreground">{job.location}</p>
              <Link
                to="/find-jobs"
                className="mt-4 rounded-lg border border-input px-3 py-2 text-center text-sm font-semibold hover:bg-secondary"
              >
                View & apply
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, to }: { label: string; value: string | number; to: "/applications" | "/saved" | "/profile" }) {
  return (
    <Link to={to} className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </Link>
  );
}
