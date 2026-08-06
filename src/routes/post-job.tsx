import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categories } from "@/data/jobs";

export const Route = createFileRoute("/post-job")({
  head: () => ({
    meta: [
      { title: "Post a Vacancy for Students — ScholarHire" },
      {
        name: "description",
        content:
          "Employers and institutions: share your requirement and reach unemployed students and scholars looking for faculty, research, IT and internship roles.",
      },
      { property: "og:title", content: "Post a Vacancy for Students — ScholarHire" },
      {
        property: "og:description",
        content: "Describe the role you need filled and reach graduates actively looking for work.",
      },
    ],
  }),
  component: PostJob,
});

function PostJob() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto w-full max-w-3xl px-5 py-12">
        <h1 className="text-3xl font-semibold sm:text-4xl">Post a vacancy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Tell us what you need and we'll list it under the right category so students with matching qualifications
          see it first.
        </p>

        {sent ? (
          <div className="mt-8 rounded-xl border border-border bg-card p-8">
            <h2 className="text-lg font-semibold">Vacancy received</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Our team reviews every listing before it goes live, usually within one working day.
            </p>
          </div>
        ) : (
          <form
            className="mt-8 grid gap-5 rounded-xl border border-border bg-card p-6 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
              toast.success("Vacancy submitted for review");
            }}
          >
            <Field label="Organisation name" name="company" placeholder="Sunrise Institute of Science" />
            <Field label="Contact email" name="email" type="email" placeholder="hr@example.com" />
            <Field label="Role title" name="title" placeholder="Assistant Professor — Physics" />
            <Field label="Location" name="location" placeholder="Pune, Maharashtra" />
            <div>
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>
                  Select a category
                </option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <Field label="Pay / stipend" name="stipend" placeholder="₹48,000 – ₹62,000 per month" />
            <div className="sm:col-span-2">
              <label htmlFor="description" className="text-sm font-medium">
                Requirement details
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                placeholder="Qualification needed, responsibilities, number of openings and joining date."
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:col-span-2 sm:w-fit"
            >
              Submit vacancy
            </button>
          </form>
        )}
      </div>

      <SiteFooter />
    </div>
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
