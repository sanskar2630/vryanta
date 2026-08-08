import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Banknote, Clock, GraduationCap, MapPin } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ApplyForm } from "@/components/apply-form";
import { getCategory, getJob, type Job } from "@/data/jobs";

export const Route = createFileRoute("/jobs/$jobId")({
  loader: ({ params }): { job: Job } => {
    const job = getJob(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Vacancy unavailable — Vryanta" }, { name: "robots", content: "noindex" }] };
    }
    const { job } = loaderData;
    const title = `${job.title} at ${job.company} — Vryanta`;
    return {
      meta: [
        { title },
        { name: "description", content: job.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: job.summary },
      ],
    };
  },
  component: JobDetail,
});

function JobDetail() {
  const { job } = Route.useLoaderData();
  const category = getCategory(job.category);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <Link
          to="/jobs"
          search={{ category: job.category }}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to {category?.name ?? "vacancies"}
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <article>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
              {category?.name ?? job.category}
            </span>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">{job.title}</h1>
            <p className="mt-2 text-base font-medium text-muted-foreground">
              {job.company} · posted {job.posted}
            </p>

            <dl className="mt-6 grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
              <Detail icon={<MapPin className="size-4 text-accent" />} label="Location" value={job.location} />
              <Detail icon={<Clock className="size-4 text-accent" />} label="Type" value={job.type} />
              <Detail icon={<Banknote className="size-4 text-accent" />} label="Pay" value={job.stipend} />
              <Detail
                icon={<GraduationCap className="size-4 text-accent" />}
                label="Qualification"
                value={job.qualification}
              />
            </dl>

            <h2 className="mt-10 text-xl font-semibold">About this role</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{job.summary}</p>

            <h2 className="mt-8 text-xl font-semibold">What you'll do</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {job.responsibilities.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="mt-8 text-xl font-semibold">Who can apply</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {job.requirements.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <ApplyForm jobTitle={job.title} company={job.company} />
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}
