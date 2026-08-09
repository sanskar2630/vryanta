import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, ClipboardList, GraduationCap, Search, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { InfoCard, MarketingPage, SectionHeading, StepCard } from "@/components/marketing";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How Vryanta Works — Profile to application in four steps" },
      {
        name: "description",
        content:
          "Create a profile, add education and skills, discover matching opportunities, then apply and track everything in one place.",
      },
      { property: "og:title", content: "How Vryanta Works — Profile to application in four steps" },
      {
        property: "og:description",
        content: "A walkthrough of profile-based opportunity discovery on Vryanta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <MarketingPage
      eyebrow="How it works"
      title="From an empty profile to a tracked application"
      intro="Vryanta turns one structured profile into ranked opportunities. Here's every step, and what happens behind each one."
    >
      <ol className="grid gap-4 sm:grid-cols-2">
        <StepCard index={1} title="Create your profile">
          Sign up with email and password or continue with Google. You choose whether you're a job seeker or an
          employer at signup.
        </StepCard>
        <StepCard index={2} title="Add education and skills">
          Guided onboarding collects your basics, education level, course and institution, technical and soft
          skills, languages and interests.
        </StepCard>
        <StepCard index={3} title="Discover matching opportunities">
          Every opportunity is scored against your profile, sorted by fit, and filterable by qualification,
          category, location, work type and experience level.
        </StepCard>
        <StepCard index={4} title="Apply and track">
          Apply with your profile, save opportunities for later, and follow each application through its status
          stages.
        </StepCard>
      </ol>

      <section className="mt-12">
        <SectionHeading
          title="How the match score is calculated"
          description="No black box. The score is a deterministic rule-based comparison, and you can always see the reasons behind it."
        />
        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
          {[
            "Skills you listed that appear in the opportunity's requirements or description.",
            "Desired job titles compared against the role title.",
            "Your city and preferred locations compared against the opportunity's location.",
            "Preferred work type (full-time, internship, contract) and work mode (on-site, hybrid, remote).",
          ].map((item) => (
            <li key={item} className="flex gap-3 rounded-lg border border-border bg-card p-4">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-lg border border-dashed border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
          The scorer is intentionally simple and lives in one module, so a real recommendation service can replace
          it later. Vryanta does not run a machine-learning model today and won't pretend otherwise.
        </p>
      </section>

      <section className="mt-12">
        <SectionHeading title="What you get on the platform today" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoCard icon={<UserPlus className="size-5" />} title="A resume-style profile">
            Headline, about section, education, experience, certifications, skills, languages and preferences.
          </InfoCard>
          <InfoCard icon={<Search className="size-5" />} title="Filtered discovery">
            Search by title or skill, and narrow by category, location, qualification, work type and experience.
          </InfoCard>
          <InfoCard icon={<Sparkles className="size-5" />} title="Recommendations">
            A dashboard that reorders opportunities each time you sharpen your profile.
          </InfoCard>
          <InfoCard icon={<Bookmark className="size-5" />} title="Saved opportunities">
            Bookmark anything and come back to it from any device you're signed in on.
          </InfoCard>
          <InfoCard icon={<ClipboardList className="size-5" />} title="Application tracking">
            Applied, Under Review, Shortlisted, Interview and Rejected stages in one list.
          </InfoCard>
          <InfoCard icon={<GraduationCap className="size-5" />} title="A digital resume">
            Generate a clean, printable resume from the profile you already filled in.
          </InfoCard>
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent" />
          <div>
            <h2 className="font-display text-lg font-semibold">Before you apply</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Listings on Vryanta are not verified yet, and some are clearly labelled sample listings. Confirm the
              organisation independently, and never pay money to apply for an opportunity.
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/auth/signup"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Create your profile
          </Link>
          <Link to="/jobs" className="rounded-lg border border-input px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
            Browse opportunities
          </Link>
        </div>
      </section>
    </MarketingPage>
  );
}
