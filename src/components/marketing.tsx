import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function MarketingPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="surface-navy">
        <div className="mx-auto w-full max-w-4xl px-5 py-14 sm:py-20">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-foreground/70">{eyebrow}</p>
          ) : null}
          <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">{title}</h1>
          {intro ? <p className="mt-4 max-w-2xl text-base text-navy-foreground/80">{intro}</p> : null}
        </div>
      </div>
      <main className="mx-auto w-full max-w-4xl px-5 py-12 sm:py-16">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
    </div>
  );
}

export function InfoCard({
  icon,
  title,
  children,
  badge,
}: {
  icon?: ReactNode;
  title: string;
  children: ReactNode;
  badge?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        {icon ? <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent/12 text-accent">{icon}</span> : null}
        {badge ? (
          <span className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {badge}
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

export function StepCard({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <li className="relative rounded-xl border border-border bg-card p-5">
      <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {index}
      </span>
      <h3 className="mt-4 font-display text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{children}</p>
    </li>
  );
}

export function ScrollSteps({
  className,
  steps,
}: {
  className?: string;
  steps: Array<{ title: string; body: ReactNode }>;
}) {
  return (
    <ol className={className ? `grid gap-4 md:grid-cols-2 ${className}` : "grid gap-4 md:grid-cols-2"}>
      {steps.map((step, index) => (
        <StepCard key={step.title} index={index + 1} title={step.title}>
          {step.body}
        </StepCard>
      ))}
    </ol>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">{children}</div>;
}
