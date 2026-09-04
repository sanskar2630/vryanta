import { useState } from "react";
import { toast } from "sonner";

export function ApplyForm({ jobTitle, company }: { jobTitle: string; company: string }) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">Application sent</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your details for <span className="font-medium text-foreground">{jobTitle}</span> have been shared with{" "}
          {company}. Keep an eye on your email for their response.
        </p>
      </aside>
    );
  }

  return (
    <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold">Apply for this role</h2>
      <p className="mt-1 text-sm text-muted-foreground">Free for students — no placement fee.</p>
      <form
        className="mt-5 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
          toast.success("Application submitted", { description: `${jobTitle} · ${company}` });
        }}
      >
        <Field label="Full name" name="name" placeholder="Aarav Sharma" />
        <Field label="Email" name="email" type="email" placeholder="you@example.com" />
        <Field label="Highest qualification" name="qualification" placeholder="M.Sc. Physics, 2025" />
        <div>
          <label htmlFor="note" className="text-sm font-medium">
            Why you're a fit
          </label>
          <textarea
            id="note"
            name="note"
            rows={4}
            required
            placeholder="Tell the employer about your studies, projects or teaching experience."
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Submit application
        </button>
      </form>
    </aside>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
