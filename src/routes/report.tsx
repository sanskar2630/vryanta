import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";
import { MarketingPage, SectionHeading } from "@/components/marketing";
import { PrototypeNote } from "@/components/prototype";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an Issue — Vryanta" },
      {
        name: "description",
        content:
          "Report a suspicious listing, a bug or anything unsafe you found on Vryanta. Never pay money to apply for an opportunity.",
      },
      { property: "og:title", content: "Report an Issue — Vryanta" },
      { property: "og:description", content: "Report a suspicious listing or a bug you found on Vryanta." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReportPage,
});

const kinds = [
  "Suspicious or fraudulent listing",
  "Listing asked me for money",
  "Misleading role or salary details",
  "Bug or broken page",
  "Something else",
];

function ReportPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ kind: kinds[0]!, reference: "", details: "", email: "" });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (form.details.trim().length < 10) {
      toast.error("Please describe the issue in a bit more detail.");
      return;
    }
    setSent(true);
    toast.success("Report noted", { description: "Moderation tooling is still being built." });
  }

  return (
    <MarketingPage
      eyebrow="Trust and safety"
      title="Report a listing or an issue"
      intro="If an opportunity feels wrong, tell us. Reporting takes a minute and helps protect other job seekers."
    >
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-accent" />
          <div>
            <h2 className="font-display text-base font-semibold">Quick safety checklist</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Never pay registration, training or security money to apply for a legitimate opportunity.</li>
              <li>Verify the organisation independently before sharing documents or ID.</li>
              <li>Be careful with any listing that only uses a personal email or messaging app.</li>
              <li>Vryanta does not verify listings yet, so treat every opportunity with normal caution.</li>
            </ul>
          </div>
        </div>
      </div>

      {sent ? (
        <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="font-display text-lg font-semibold">Report received</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Thanks for flagging it. Reports are captured in the prototype UI while we build proper moderation
            tooling, so please also avoid the listing yourself.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setSent(false)}
              className="rounded-lg border border-input px-4 py-2.5 text-sm font-semibold hover:bg-secondary"
            >
              Report something else
            </button>
            <Link
              to="/jobs"
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Back to opportunities
            </Link>
          </div>
        </div>
      ) : (
        <section className="mt-10">
          <SectionHeading title="Tell us what happened" />
          <form onSubmit={submit} className="mt-6 grid gap-5 rounded-xl border border-border bg-card p-6">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Type of issue</span>
              <select
                value={form.kind}
                onChange={(event) => setForm((prev) => ({ ...prev, kind: event.target.value }))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {kinds.map((kind) => (
                  <option key={kind} value={kind}>
                    {kind}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Listing or page (optional)</span>
              <input
                value={form.reference}
                onChange={(event) => setForm((prev) => ({ ...prev, reference: event.target.value }))}
                placeholder="Role title, organisation or page link"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">What happened?</span>
              <textarea
                required
                rows={5}
                maxLength={1000}
                value={form.details}
                onChange={(event) => setForm((prev) => ({ ...prev, details: event.target.value }))}
                placeholder="Describe what you saw or what was asked of you."
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Your email (optional)</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Only if you'd like a reply"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <PrototypeNote>
              Reports are collected in the interface only for now. There is no moderation queue behind this form yet.
            </PrototypeNote>
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground fluid hover:opacity-90 sm:w-fit"
            >
              Submit report
            </button>
          </form>
        </section>
      )}
    </MarketingPage>
  );
}
