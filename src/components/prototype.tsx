import { useState } from "react";
import { Flag, Inbox, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ReactNode } from "react";

/** Marks listings that ship with the prototype rather than coming from a real employer. */
export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      title="Sample listing included with the Vryanta prototype"
      className={`inline-flex items-center rounded-full border border-border bg-secondary/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground ${className}`}
    >
      Demo opportunity
    </span>
  );
}

export function PrototypeNote({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-lg border border-dashed border-border bg-secondary/40 p-3 text-xs leading-relaxed text-muted-foreground">
      <ShieldAlert className="mt-0.5 size-4 shrink-0 text-accent" />
      <span>{children}</span>
    </p>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
        {icon ?? <Inbox className="size-5" />}
      </span>
      <p className="mt-4 font-display text-base font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function CardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-xl border border-border bg-card p-5">
          <div className="h-5 w-24 animate-pulse rounded-full bg-secondary" />
          <div className="mt-4 h-5 w-3/4 animate-pulse rounded bg-secondary" />
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-secondary" />
          <div className="mt-4 h-4 w-full animate-pulse rounded bg-secondary" />
          <div className="mt-2 h-4 w-5/6 animate-pulse rounded bg-secondary" />
          <div className="mt-5 h-9 w-full animate-pulse rounded-lg bg-secondary" />
        </div>
      ))}
    </div>
  );
}

const reasons = [
  "Asks for money or a fee",
  "Looks like a scam or fake company",
  "Misleading salary or role details",
  "Offensive or discriminatory content",
  "Something else",
];

export function ReportJobDialog({ jobTitle, company }: { jobTitle: string; company: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(reasons[0]!);
  const [note, setNote] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setOpen(false);
    setNote("");
    toast.success("Report noted", {
      description: "Reports are collected in the prototype UI only — moderation tooling is coming soon.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground fluid hover:text-destructive"
        >
          <Flag className="size-4" />
          Report job
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report this listing</DialogTitle>
          <DialogDescription>
            {jobTitle} · {company}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label htmlFor="report-reason" className="mb-1.5 block text-sm font-medium">
              What's wrong?
            </label>
            <select
              id="report-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {reasons.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="report-note" className="mb-1.5 block text-sm font-medium">
              Details (optional)
            </label>
            <textarea
              id="report-note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Anything that helps us understand the issue."
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <PrototypeNote>
            Vryanta does not verify every listing yet. Never pay money to apply for an opportunity.
          </PrototypeNote>
          <DialogFooter>
            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 sm:w-auto"
            >
              Submit report
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
