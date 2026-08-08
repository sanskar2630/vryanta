import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/app-shell";
import { useProfile, useResumeSections } from "@/hooks/use-vryanta";

export const Route = createFileRoute("/_authenticated/resume")({
  head: () => ({
    meta: [
      { title: "Digital resume — Vryanta" },
      { name: "description", content: "A clean resume generated from your Vryanta profile." },
      { property: "og:title", content: "Digital resume — Vryanta" },
      { property: "og:description", content: "A clean resume generated from your Vryanta profile." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResumePage,
});

function ResumePage() {
  const { data: profile } = useProfile();
  const { data: sections } = useResumeSections();
  const skills = profile?.skills ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Digital resume" description="Generated from your profile. Use your browser's print dialog to save as PDF." />
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        Download / Print
      </button>
      <article className="space-y-6 rounded-xl border border-border bg-card p-6">
        <header>
          <h2 className="font-display text-2xl font-semibold">{profile?.full_name ?? "Your name"}</h2>
          <p className="text-sm text-muted-foreground">{profile?.headline ?? "Add a headline in your profile"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {[profile?.email, profile?.phone, profile?.location].filter(Boolean).join(" · ")}
          </p>
        </header>
        {profile?.about ? (
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">About</h3>
            <p className="mt-2 text-sm">{profile.about}</p>
          </section>
        ) : null}
        {skills.length ? (
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Skills</h3>
            <p className="mt-2 text-sm">{skills.join(" · ")}</p>
          </section>
        ) : null}
        {sections?.education.length ? (
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Education</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {sections.education.map((row) => (
                <li key={row.id}>
                  <span className="font-medium">{row.degree}</span> — {row.institution}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {sections?.experience.length ? (
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Experience</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {sections.experience.map((row) => (
                <li key={row.id}>
                  <span className="font-medium">{row.title}</span> — {row.company}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {sections?.certifications.length ? (
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Certifications</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {sections.certifications.map((row) => (
                <li key={row.id}>{row.name}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </div>
  );
}
