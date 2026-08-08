import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { useApplications } from "@/hooks/use-vryanta";

export const Route = createFileRoute("/_authenticated/applications")({
  head: () => ({
    meta: [
      { title: "My applications — Vryanta" },
      { name: "description", content: "Track every role you applied to and its current status." },
      { property: "og:title", content: "My applications — Vryanta" },
      { property: "og:description", content: "Track every role you applied to and its current status." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const { data: applications = [], isLoading } = useApplications();

  return (
    <div className="space-y-6">
      <PageHeader title="My Applications" description="Every application is linked to your Vryanta account." />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : applications.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          You haven't applied to anything yet. Head to Find Jobs to get started.
        </p>
      ) : (
        <ul className="space-y-3">
          {applications.map((application) => (
            <li key={application.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{application.job_title}</p>
                  <p className="text-sm text-muted-foreground">{application.company}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Applied {new Date(application.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold">{application.status}</span>
                  <p className="mt-2 text-sm font-semibold text-accent">{application.match_score}% Match</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
