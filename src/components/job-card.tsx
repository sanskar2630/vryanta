import { Link } from "@tanstack/react-router";
import { Banknote, Clock, MapPin } from "lucide-react";
import { DemoBadge } from "@/components/prototype";
import { getCategory, type Job } from "@/data/jobs";

export function JobCard({ job }: { job: Job }) {
  const category = getCategory(job.category);

  return (
    <Link
      to="/jobs/$jobId"
      params={{ jobId: job.id }}
      className="card-lift fluid flex h-full flex-col rounded-xl border border-border bg-card p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
          {category?.name ?? job.category}
        </span>
        <span className="text-xs text-muted-foreground">{job.posted}</span>
      </div>
      <DemoBadge className="mt-3 w-fit" />

      <h3 className="mt-3 text-lg font-semibold leading-snug">{job.title}</h3>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{job.company}</p>
      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{job.summary}</p>
      <dl className="mt-4 grid gap-2 border-t border-border pt-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4 text-accent" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4 text-accent" />
          <span>{job.type}</span>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <Banknote className="size-4 text-accent" />
          <span>{job.stipend}</span>
        </div>
      </dl>
    </Link>
  );
}
