import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, Building2, Search } from "lucide-react";
import heroImage from "@/assets/hero-students.jpg";
import { JobCard } from "@/components/job-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categories, countByCategory, jobs } from "@/data/jobs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vryanta — Jobs for Unemployed Students & Scholars" },
      {
        name: "description",
        content:
          "Free job board for unemployed students and scholars. Browse faculty, research, IT, internship and government vacancies by category and apply directly.",
      },
      { property: "og:title", content: "Vryanta — Jobs for Unemployed Students & Scholars" },
      {
        property: "og:description",
        content: "Browse verified vacancies by category — teaching, research, IT, internships and government posts.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = jobs.filter((job) => job.featured);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="surface-navy">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-navy-foreground/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <BadgeCheck className="size-4" />
              {jobs.length} open vacancies today
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              Jobs for scholars who are still waiting for their first break
            </h1>
            <p className="mt-5 max-w-xl text-base text-navy-foreground/80">
              Vryanta lists faculty, research, IT, internship and government openings sorted by category.
              Companies and institutions post what they need — students apply for free.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                <Search className="size-4" />
                Find jobs by category
              </Link>
              <Link
                to="/post-job"
                className="inline-flex items-center gap-2 rounded-lg border border-navy-foreground/30 px-5 py-3 text-sm font-semibold transition-colors hover:bg-navy-foreground/10"
              >
                <Building2 className="size-4" />
                I'm hiring
              </Link>
            </div>
          </div>
          <img
            src={heroImage}
            alt="Students and scholars working together on laptops in a university library"
            width={1600}
            height={1104}
            className="w-full rounded-2xl object-cover shadow-2xl"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <h2 className="text-2xl font-semibold sm:text-3xl">Browse by category</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pick the stream that matches your qualification. Every category is updated as institutions and companies
          send in new requirements.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to="/jobs"
              search={{ category: category.slug }}
              className="card-lift rounded-xl border border-border bg-card p-5"
            >
              <p className="font-display text-base font-semibold">{category.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{category.blurb}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                {countByCategory(category.slug)} openings
                <ArrowRight className="size-4" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-2xl font-semibold sm:text-3xl">Featured openings</h2>
          <Link to="/jobs" className="text-sm font-semibold text-accent hover:underline">
            View all vacancies
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
