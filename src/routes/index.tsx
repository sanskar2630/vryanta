import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  Building2,
  ClipboardList,
  Compass,
  FileUp,
  GraduationCap,
  ListChecks,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  UserPlus,
} from "lucide-react";
import heroImage from "@/assets/hero-students.jpg";
import { JobCard } from "@/components/job-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { InfoCard, SectionHeading, StepCard } from "@/components/marketing";
import { categories, countByCategory, jobs } from "@/data/jobs";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vryanta — Find Opportunities That Match Your Qualifications" },
      {
        name: "description",
        content:
          "Vryanta helps students, freshers and job seekers discover opportunities matched to their education, skills, interests and location. Create a profile and start applying.",
      },
      { property: "og:title", content: "Vryanta — Find Opportunities That Match Your Qualifications" },
      {
        property: "og:description",
        content:
          "Qualification-based discovery and skill matching for students, freshers and job seekers in India.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
              <Sparkles className="size-4" />
              Early-stage prototype
            </span>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              Find opportunities that actually match your qualifications
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-foreground/80">
              Vryanta is being built for students, freshers and job seekers. Tell us your education, skills and
              location once — then see opportunities ranked by how well they fit you, instead of scrolling through
              listings you can't apply for.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                <Search className="size-4" />
                Find Jobs
              </Link>
              <Link
                to="/auth/signup"
                className="inline-flex items-center gap-2 rounded-lg border border-navy-foreground/30 px-5 py-3 text-sm font-semibold transition-colors hover:bg-navy-foreground/10"
              >
                <UserPlus className="size-4" />
                Create Profile
              </Link>
              <Link
                to="/post-job"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-navy-foreground/80 transition-colors hover:text-navy-foreground"
              >
                <Building2 className="size-4" />
                Post a Vacancy
              </Link>
            </div>
            <p className="mt-6 text-xs text-navy-foreground/60">
              Free for students and freshers. Sample listings are clearly labelled while we onboard real employers.
            </p>
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

      {/* Problem */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <SectionHeading
          eyebrow="The problem"
          title="Qualified people still miss the right opportunities"
          description="Most job platforms are built around employers and experience. Students, freshers and first-time job seekers end up filtering through thousands of listings that don't match their degree, their skills, or the city they can actually work in."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <InfoCard icon={<ListChecks className="size-5" />} title="Too much noise">
            Listings ask for experience freshers don't have yet, and there's no simple way to see what you're
            eligible for.
          </InfoCard>
          <InfoCard icon={<GraduationCap className="size-5" />} title="Qualifications ignored">
            Your degree, stream and certifications rarely drive what you're shown, even though they decide whether
            you can apply.
          </InfoCard>
          <InfoCard icon={<Compass className="size-5" />} title="No guidance">
            First-time job seekers get no signal on why a role fits them or what to improve in their profile.
          </InfoCard>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-5 py-16">
          <SectionHeading
            eyebrow="How Vryanta works"
            title="Four steps from profile to application"
            description="One structured profile powers everything else on the platform."
          />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StepCard index={1} title="Create your profile">
              Sign up with email or Google, then complete a short guided onboarding.
            </StepCard>
            <StepCard index={2} title="Add education and skills">
              Qualification, stream, institution, technical and soft skills, languages and interests.
            </StepCard>
            <StepCard index={3} title="Discover matching opportunities">
              Every opportunity gets a match score with a plain-English explanation of why it fits.
            </StepCard>
            <StepCard index={4} title="Apply and track">
              Apply in a couple of clicks, save what you like, and follow each application's status.
            </StepCard>
          </ol>
          <Link
            to="/how-it-works"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            See the full walkthrough
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Why Vryanta */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <SectionHeading
          eyebrow="Why Vryanta"
          title="Built around what you've studied and what you can do"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard icon={<GraduationCap className="size-5" />} title="Qualification-based discovery">
            Filter by the qualification you actually hold, so you only see roles you're eligible for.
          </InfoCard>
          <InfoCard icon={<Target className="size-5" />} title="Skill-based matching">
            A transparent, rule-based score compares your listed skills against each opportunity.
          </InfoCard>
          <InfoCard icon={<Sparkles className="size-5" />} title="Personalised recommendations">
            Your dashboard reorders opportunities as you add skills, preferences and locations.
          </InfoCard>
          <InfoCard icon={<ClipboardList className="size-5" />} title="Simple applications">
            Apply with your Vryanta profile, then track status in one place instead of your inbox.
          </InfoCard>
          <InfoCard icon={<UserPlus className="size-5" />} title="Made for students and freshers">
            Internships, trainee tracks, fellowships and first jobs sit at the centre, not the margins.
          </InfoCard>
          <InfoCard icon={<ShieldCheck className="size-5" />} title="Honest by default">
            Sample data is labelled, and nothing on Vryanta claims to be verified unless it is.
          </InfoCard>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16">
        <SectionHeading
          eyebrow="Categories"
          title="Browse by the stream you studied"
          description="Every category updates as institutions and companies post new requirements."
        />
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
                {countByCategory(category.slug)} listings
                <ArrowRight className="size-4" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16">
        <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Sample listings" title="A look at what opportunities feel like" />
          <Link to="/jobs" className="text-sm font-semibold text-accent hover:underline">
            View all opportunities
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-5 py-16">
          <SectionHeading
            eyebrow="Trust and safety"
            title="Apply carefully — here's what we ask you to check"
            description="Vryanta does not verify every listing yet. Until employer verification ships, treat every opportunity the way you would treat any listing on the internet."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard icon={<ShieldCheck className="size-5" />} title="Verify before applying">
              Look up the organisation independently and confirm the contact details you were given.
            </InfoCard>
            <InfoCard icon={<ShieldCheck className="size-5" />} title="Never pay to apply">
              A legitimate opportunity never asks for registration, training or security money.
            </InfoCard>
            <InfoCard icon={<ShieldCheck className="size-5" />} title="Report anything suspicious">
              Every opportunity page has a Report job action so we can review it.
            </InfoCard>
            <InfoCard icon={<ShieldCheck className="size-5" />} title="Privacy-conscious profiles">
              You choose whether employers can discover your profile, and you can change it any time.
            </InfoCard>
          </div>
          <Link to="/report" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
            Report an issue or a listing
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Coming soon */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <SectionHeading
          eyebrow="Where Vryanta is going"
          title="What we're building next"
          description="These are planned directions, not features that exist today."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard icon={<Sparkles className="size-5" />} title="AI-assisted recommendations" badge="Coming soon">
            Replace the rule-based scorer with a learning model trained on real outcomes.
          </InfoCard>
          <InfoCard icon={<ShieldCheck className="size-5" />} title="Verified employers" badge="Coming soon">
            Organisation checks so verified opportunities can be marked honestly.
          </InfoCard>
          <InfoCard icon={<Bell className="size-5" />} title="Smart alerts" badge="Coming soon">
            Email and push notifications when a strong match is posted.
          </InfoCard>
          <InfoCard icon={<Smartphone className="size-5" />} title="Mobile app" badge="Coming soon">
            A native experience for applying and tracking on the go.
          </InfoCard>
          <InfoCard icon={<Compass className="size-5" />} title="Career guidance" badge="Coming soon">
            Skill-gap suggestions and next steps based on the roles you want.
          </InfoCard>
          <InfoCard icon={<FileUp className="size-5" />} title="Resume intelligence" badge="Coming soon">
            Parse an uploaded resume to fill your profile automatically.
          </InfoCard>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-4">
        <div className="surface-navy rounded-2xl px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-semibold sm:text-3xl">Start with your profile</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-navy-foreground/80">
            It takes a few minutes. Once your education and skills are in, every opportunity you see is ranked for
            you.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/auth/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Create Profile
            </Link>
            <Link
              to="/for-employers"
              className="inline-flex items-center gap-2 rounded-lg border border-navy-foreground/30 px-5 py-3 text-sm font-semibold transition-colors hover:bg-navy-foreground/10"
            >
              I'm hiring
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
