import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { useProfile } from "@/hooks/use-vryanta";

export const Route = createFileRoute("/_authenticated/employer/")({
  head: () => ({
    meta: [
      { title: "Employer overview — Vryanta" },
      { name: "description", content: "Manage your vacancies and applicants on Vryanta." },
      { property: "og:title", content: "Employer overview — Vryanta" },
      { property: "og:description", content: "Manage your vacancies and applicants on Vryanta." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EmployerHome,
});

function EmployerHome() {
  const { data: profile } = useProfile();
  return (
    <div className="space-y-6">
      <PageHeader title={`Welcome, ${profile?.company_name || profile?.full_name || "employer"}.`} description="Post vacancies and review applicants." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/employer/post-job" className="rounded-xl border border-border bg-card p-5 hover:border-accent">
          <p className="font-semibold">Post a vacancy</p>
          <p className="mt-1 text-sm text-muted-foreground">Publish a new role to students and scholars.</p>
        </Link>
        <Link to="/employer/jobs" className="rounded-xl border border-border bg-card p-5 hover:border-accent">
          <p className="font-semibold">My jobs</p>
          <p className="mt-1 text-sm text-muted-foreground">Edit or close your existing listings.</p>
        </Link>
        <Link to="/employer/applicants" className="rounded-xl border border-border bg-card p-5 hover:border-accent">
          <p className="font-semibold">Applicants</p>
          <p className="mt-1 text-sm text-muted-foreground">Review candidates and update their status.</p>
        </Link>
      </div>
    </div>
  );
}
