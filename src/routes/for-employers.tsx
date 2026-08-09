import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Building2, ClipboardList, FileText, Users } from "lucide-react";
import { InfoCard, MarketingPage, SectionHeading, StepCard } from "@/components/marketing";

export const Route = createFileRoute("/for-employers")({
  head: () => ({
    meta: [
      { title: "For Employers — Post opportunities on Vryanta" },
      {
        name: "description",
        content:
          "Reach students, freshers and job seekers actively building profiles. Post a vacancy, review it, publish it and manage applicants from one dashboard.",
      },
      { property: "og:title", content: "For Employers — Post opportunities on Vryanta" },
      {
        property: "og:description",
        content: "Publish vacancies and manage applicants on Vryanta, an early-stage employment platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForEmployersPage,
});

function ForEmployersPage() {
  return (
    <MarketingPage
      eyebrow="For employers"
      title="Describe the role once, reach people who qualify for it"
      intro="Vryanta is an early-stage platform, so we won't promise you a candidate pool we don't have. What we do offer is structured profiles — qualification, stream, skills, languages and location — so your listing reaches people who can actually apply."
    >
      <section>
        <SectionHeading title="The employer flow" />
        <ol className="mt-6 grid gap-4 sm:grid-cols-2">
          <StepCard index={1} title="Create an employer account">
            Sign up and pick the employer account type. Add your organisation details.
          </StepCard>
          <StepCard index={2} title="Complete your organisation profile">
            Name, type, website and location so candidates know who they're applying to.
          </StepCard>
          <StepCard index={3} title="Post and review your vacancy">
            Fill in the role, qualification, skills, work type, stipend and deadline, then review before publishing.
          </StepCard>
          <StepCard index={4} title="Publish and manage applicants">
            Move applicants through Under Review, Shortlisted, Interview, Hired or Rejected.
          </StepCard>
        </ol>
      </section>

      <section className="mt-12">
        <SectionHeading title="What the employer dashboard includes" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoCard icon={<FileText className="size-5" />} title="Active vacancies">
            Every role you posted, with the ability to close listings that are filled.
          </InfoCard>
          <InfoCard icon={<Users className="size-5" />} title="Applicant overview">
            The candidates who applied to your roles, with their match score and status.
          </InfoCard>
          <InfoCard icon={<ClipboardList className="size-5" />} title="Status management">
            Update an applicant's stage and keep your pipeline in one place.
          </InfoCard>
          <InfoCard icon={<BarChart3 className="size-5" />} title="Vacancy insights" badge="Coming soon">
            View counts and funnel metrics. Not available yet — we won't display numbers we can't measure.
          </InfoCard>
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 size-5 shrink-0 text-accent" />
          <div>
            <h2 className="font-display text-lg font-semibold">Posting is free during the prototype</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              There's no pricing, contract or placement fee right now. If Vryanta introduces paid employer tools
              later, existing listings won't be held hostage behind them.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/auth/signup"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Create employer account
          </Link>
          <Link to="/post-job" className="rounded-lg border border-input px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
            Post a vacancy
          </Link>
        </div>
      </section>
    </MarketingPage>
  );
}
