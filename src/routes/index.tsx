import { createFileRoute, Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
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
import { JobCard } from "@/components/job-card";
import { MatchFlow } from "@/components/match-visual";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { InfoCard, ScrollSteps, SectionHeading } from "@/components/marketing";
import { CountUp, Magnetic, Reveal, ScoreRing, usePointerDepth } from "@/components/motion";
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

const floatingCards = [
  { title: "Research Assistant", org: "IISER Pune", score: 92, x: "6%", y: "8%", depth: 26, delay: "0s" },
  { title: "Assistant Professor", org: "Fergusson College", score: 87, x: "52%", y: "34%", depth: 16, delay: "1.1s" },
  { title: "Data Analyst Intern", org: "Vantage Labs", score: 81, x: "14%", y: "63%", depth: 34, delay: "2.2s" },
] as const;

function Home() {
  const featured = jobs.filter((job) => job.featured);
  const depthRef = usePointerDepth<HTMLDivElement>();

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* ---------------- Hero: profile → skills → engine → opportunities ---------------- */}
      <section ref={depthRef} className="surface-navy depth-field">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.02fr_1fr] lg:py-24">
          <div>
            <Reveal>
              <span className="glass-panel inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                <Sparkles className="size-4" />
                Early-stage prototype
              </span>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
                Your qualifications,
                <span className="block text-teal-soft">matched to real opportunities</span>
              </h1>
            </Reveal>
            <Reveal delay={170}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-foreground/80">
                Tell Vryanta what you studied, what you can do and where you can work — once. Every opportunity is
                then ranked for you, with a plain-English reason for the score.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Magnetic>
                  <Link
                    to="/jobs"
                    className="btn-press inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-black/20 hover:opacity-95"
                  >
                    <Search className="size-4" />
                    Find Jobs
                  </Link>
                </Magnetic>
                <Magnetic>
                  <Link
                    to="/auth/signup"
                    className="btn-press glass-panel inline-flex items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold"
                  >
                    <UserPlus className="size-4" />
                    Create Profile
                  </Link>
                </Magnetic>
                <Link
                  to="/post-job"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-navy-foreground/75 transition-colors hover:text-navy-foreground"
                >
                  <Building2 className="size-4" />
                  Post a Vacancy
                </Link>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-navy-foreground/15 pt-6">
                <HeroStat value={jobs.length} label="Sample openings" />
                <HeroStat value={categories.length} label="Career categories" />
                <HeroStat value={10} suffix=" fields" label="Profile signals used" />
              </dl>
            </Reveal>
          </div>

          {/* Pointer-parallax stage with floating match cards */}
          <div className="relative md:min-h-[28rem]">
            <div
              className="glass-panel absolute inset-0 rounded-3xl"
              style={{
                transform:
                  "translate3d(calc(var(--depth-x, 0) * 10px), calc(var(--depth-y, 0) * 10px), 0)",
              }}
            />
            <div className="relative grid grid-cols-1 gap-3 p-3 md:absolute md:inset-0 md:block md:p-0">
              {floatingCards.map((card, index) => (
                <Reveal key={card.title} delay={200 + index * 130} variant="scale" className="min-w-0">
                  <div
                    className="relative left-0 top-0 w-full min-w-0 transform-none md:absolute md:left-[var(--card-x)] md:top-[var(--card-y)] md:w-[15rem] md:max-w-[78%] md:transform-[var(--card-transform)]"
                    style={{
                      "--card-x": card.x,
                      "--card-y": card.y,
                      "--card-transform": `translate3d(calc(var(--depth-x, 0) * ${card.depth}px), calc(var(--depth-y, 0) * ${card.depth}px), 0)`,
                      transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
                    } as CSSProperties}
                  >
                    <div className="float-slow" style={{ animationDelay: card.delay }}>
                      <div className="glass-panel flex min-h-11 w-full min-w-0 items-center gap-2.5 rounded-2xl p-3 shadow-xl shadow-black/25 md:gap-3 md:p-3.5">
                        <ScoreRing value={card.score} size={56} />
                        <div className="min-w-0 flex-1">
                          <p className="break-words font-display text-sm font-semibold leading-snug md:truncate">{card.title}</p>
                          <p className="mt-0.5 break-words text-xs leading-snug text-navy-foreground/70 md:mt-0 md:truncate">{card.org}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <p className="relative px-3 pb-3 text-center text-[11px] text-navy-foreground/55 md:absolute md:bottom-3 md:left-0 md:right-0 md:p-0">
              Illustrative match cards — sample data
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Problem ---------------- */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <Reveal>
          <SectionHeading
            eyebrow="The problem"
            title="Qualified people still miss the right opportunities"
            description="Most job platforms are built around employers and experience. Students, freshers and first-time job seekers end up filtering through thousands of listings that don't match their degree, their skills, or the city they can actually work in."
          />
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: <ListChecks className="size-5" />,
              title: "Too much noise",
              body: "Listings ask for experience freshers don't have yet, and there's no simple way to see what you're eligible for.",
            },
            {
              icon: <GraduationCap className="size-5" />,
              title: "Qualifications ignored",
              body: "Your degree, stream and certifications rarely drive what you're shown, even though they decide whether you can apply.",
            },
            {
              icon: <Compass className="size-5" />,
              title: "No guidance",
              body: "First-time job seekers get no signal on why a role fits them or what to improve in their profile.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <InfoCard icon={item.icon} title={item.title}>
                {item.body}
              </InfoCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Signature matching visualisation ---------------- */}
      <section className="border-y border-border/70 bg-secondary/30">
        <div className="mx-auto w-full max-w-6xl px-5 py-16">
          <Reveal>
            <SectionHeading
              eyebrow="Matching, visualised"
              title="From your profile to a ranked shortlist"
              description="Vryanta reads your qualifications, skills, interests and location preferences, then scores every opportunity with a transparent rule-based engine. No black box, and no AI claims."
            />
          </Reveal>
          <MatchFlow className="mt-10" />
        </div>
      </section>

      {/* ---------------- Scroll-activated walkthrough ---------------- */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <Reveal>
          <SectionHeading
            eyebrow="How Vryanta works"
            title="Four steps from profile to application"
            description="One structured profile powers everything else on the platform."
          />
        </Reveal>
        <ScrollSteps
          className="mt-10"
          steps={[
            {
              title: "Create your profile",
              body: "Sign up with email or Google, then complete a short guided onboarding in five steps.",
            },
            {
              title: "Add education and skills",
              body: "Qualification, stream, institution, technical and soft skills, languages and interests.",
            },
            {
              title: "Discover matching opportunities",
              body: "Every opportunity gets a match score with a plain-English explanation of why it fits.",
            },
            {
              title: "Apply and track",
              body: "Apply in a couple of clicks, save what you like, and follow each application's status.",
            },
          ]}
        />
        <Reveal>
          <Link
            to="/how-it-works"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
          >
            See the full walkthrough
            <ArrowRight className="size-4" />
          </Link>
        </Reveal>
      </section>

      {/* ---------------- Why Vryanta ---------------- */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16">
        <Reveal>
          <SectionHeading eyebrow="Why Vryanta" title="Built around what you've studied and what you can do" />
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <GraduationCap className="size-5" />,
              title: "Qualification-based discovery",
              body: "Filter by the qualification you actually hold, so you only see roles you're eligible for.",
            },
            {
              icon: <Target className="size-5" />,
              title: "Skill-based matching",
              body: "A transparent, rule-based score compares your listed skills against each opportunity.",
            },
            {
              icon: <Sparkles className="size-5" />,
              title: "Personalised recommendations",
              body: "Your dashboard reorders opportunities as you add skills, preferences and locations.",
            },
            {
              icon: <ClipboardList className="size-5" />,
              title: "Simple applications",
              body: "Apply with your Vryanta profile, then track status in one place instead of your inbox.",
            },
            {
              icon: <UserPlus className="size-5" />,
              title: "Made for students and freshers",
              body: "Internships, trainee tracks, fellowships and first jobs sit at the centre, not the margins.",
            },
            {
              icon: <ShieldCheck className="size-5" />,
              title: "Honest by default",
              body: "Sample data is labelled, and nothing on Vryanta claims to be verified unless it is.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={(index % 3) * 80}>
              <InfoCard icon={item.icon} title={item.title}>
                {item.body}
              </InfoCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Categories ---------------- */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16">
        <Reveal>
          <SectionHeading
            eyebrow="Categories"
            title="Browse by the stream you studied"
            description="Every category updates as institutions and companies post new requirements."
          />
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Reveal key={category.slug} delay={(index % 4) * 70}>
              <Link
                to="/jobs"
                search={{ category: category.slug }}
                className="card-lift tilt-surface block h-full rounded-xl border border-border bg-card p-5"
              >
                <p className="font-display text-base font-semibold">{category.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{category.blurb}</p>
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                  {countByCategory(category.slug)} listings
                  <ArrowRight className="size-4" />
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Featured ---------------- */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16">
        <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Sample listings" title="A look at what opportunities feel like" />
          <Link to="/jobs" className="text-sm font-semibold text-accent hover:underline">
            View all opportunities
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((job, index) => (
            <Reveal key={job.id} delay={(index % 3) * 80} className="h-full">
              <JobCard job={job} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Trust ---------------- */}
      <section className="border-y border-border/70 bg-secondary/40">
        <div className="mx-auto w-full max-w-6xl px-5 py-16">
          <Reveal>
            <SectionHeading
              eyebrow="Trust and safety"
              title="Apply carefully — here's what we ask you to check"
              description="Vryanta does not verify every listing yet. Until employer verification ships, treat every opportunity the way you would treat any listing on the internet."
            />
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Verify before applying", "Look up the organisation independently and confirm the contact details you were given."],
              ["Never pay to apply", "A legitimate opportunity never asks for registration, training or security money."],
              ["Report anything suspicious", "Every opportunity page has a Report job action so we can review it."],
              ["Privacy-conscious profiles", "You choose whether employers can discover your profile, and you can change it any time."],
            ].map(([title, body], index) => (
              <Reveal key={title} delay={index * 80}>
                <InfoCard icon={<ShieldCheck className="size-5" />} title={title!}>
                  {body}
                </InfoCard>
              </Reveal>
            ))}
          </div>
          <Link to="/report" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
            Report an issue or a listing
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* ---------------- Roadmap ---------------- */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Where Vryanta is going"
            title="What we're building next"
            description="These are planned directions, not features that exist today."
          />
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <Sparkles className="size-5" />,
              title: "AI-assisted recommendations",
              body: "Replace the rule-based scorer with a learning model trained on real outcomes.",
            },
            {
              icon: <ShieldCheck className="size-5" />,
              title: "Verified employers",
              body: "Organisation checks so verified opportunities can be marked honestly.",
            },
            {
              icon: <Bell className="size-5" />,
              title: "Smart alerts",
              body: "Email and push notifications when a strong match is posted.",
            },
            {
              icon: <Smartphone className="size-5" />,
              title: "Mobile app",
              body: "A native experience for applying and tracking on the go.",
            },
            {
              icon: <Compass className="size-5" />,
              title: "Career guidance",
              body: "Skill-gap suggestions and next steps based on the roles you want.",
            },
            {
              icon: <FileUp className="size-5" />,
              title: "Resume intelligence",
              body: "Parse an uploaded resume to fill your profile automatically.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={(index % 3) * 80}>
              <InfoCard icon={item.icon} title={item.title} badge="Coming soon">
                {item.body}
              </InfoCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-4">
        <Reveal variant="scale">
          <div className="surface-navy depth-field rounded-3xl px-6 py-14 text-center sm:px-12">
            <h2 className="text-2xl font-semibold sm:text-3xl">Start with your profile</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-navy-foreground/80">
              It takes a few minutes. Once your education and skills are in, every opportunity you see is ranked for
              you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Magnetic>
                <Link
                  to="/auth/signup"
                  className="btn-press inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-lg shadow-black/20 hover:opacity-95"
                >
                  Create Profile
                  <ArrowRight className="size-4" />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/for-employers"
                  className="btn-press glass-panel inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold"
                >
                  I'm hiring
                </Link>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  );
}

function HeroStat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div>
      <dt className="font-display text-2xl font-semibold">
        <CountUp value={value} suffix={suffix ?? ""} />
      </dt>
      <dd className="mt-1 text-xs text-navy-foreground/70">{label}</dd>
    </div>
  );
}
