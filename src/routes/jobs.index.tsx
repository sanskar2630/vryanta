import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { JobCard } from "@/components/job-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categories, countByCategory, jobs } from "@/data/jobs";

type JobSearch = { category?: string | undefined };

export const Route = createFileRoute("/jobs/")({
  validateSearch: (search: Record<string, unknown>): JobSearch => ({
    category: typeof search["category"] === "string" ? (search["category"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse Student & Scholar Vacancies — Vryanta" },
      {
        name: "description",
        content:
          "Search open vacancies for students and scholars by category: teaching, research, IT, data, internships, administration, government and part-time work.",
      },
      { property: "og:title", content: "Browse Student & Scholar Vacancies — Vryanta" },
      {
        name: "og:description",
        content: "Filter openings by category and apply free — no placement fee for students.",
      },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState("");

  const results = jobs.filter((job) => {
    const matchesCategory = !category || job.category === category;
    const text = `${job.title} ${job.company} ${job.location} ${job.qualification}`.toLowerCase();
    return matchesCategory && text.includes(query.trim().toLowerCase());
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto w-full max-w-6xl px-5 py-12">
        <h1 className="text-3xl font-semibold sm:text-4xl">Open vacancies</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "role" : "roles"} matching your filters.
        </p>

        <label className="mt-6 flex items-center gap-3 rounded-lg border border-input bg-card px-4 py-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by role, institution, city or qualification"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            onClick={() => navigate({ search: {} })}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              !category ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary"
            }`}
          >
            All ({jobs.length})
          </button>
          {categories.map((item) => (
            <button
              key={item.slug}
              onClick={() => navigate({ search: { category: item.slug } })}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                category === item.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-secondary"
              }`}
            >
              {item.name} ({countByCategory(item.slug)})
            </button>
          ))}
        </div>

        {results.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-xl border border-dashed border-border p-10 text-center">
            <p className="font-semibold">No vacancies match that search yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try a different category, or{" "}
              <Link to="/post-job" className="font-semibold text-accent hover:underline">
                ask an employer to post a role
              </Link>
              .
            </p>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}
