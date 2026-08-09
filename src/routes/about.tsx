import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Compass, Database, ShieldCheck, Smartphone, Sparkles, Wrench } from "lucide-react";
import { InfoCard, MarketingPage, Prose, SectionHeading } from "@/components/marketing";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Vryanta — Our mission and roadmap" },
      {
        name: "description",
        content:
          "Vryanta wants to make opportunity discovery simpler and more accessible for students, freshers and job seekers through profile-based matching.",
      },
      { property: "og:title", content: "About Vryanta — Our mission and roadmap" },
      {
        property: "og:description",
        content: "Why Vryanta exists, the problem it addresses, and what the team plans to build next.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <MarketingPage
      eyebrow="About"
      title="Make opportunity discovery simpler and more accessible"
      intro="Vryanta is an early-stage platform for students, freshers and job seekers. Our mission is to help people find opportunities that match their actual qualifications and skills."
    >
      <section>
        <SectionHeading title="The problem we're addressing" />
        <Prose>
          <p>
            People often struggle to find opportunities relevant to their actual qualifications and skills. Job
            listings are written for recruiters, sorted by recency, and filtered by years of experience — which
            leaves students, fresh graduates and career starters guessing.
          </p>
          <p>
            The result is familiar: dozens of applications sent into a void, no feedback, and no clarity on whether
            a role was ever a realistic fit.
          </p>
        </Prose>
      </section>

      <section className="mt-12">
        <SectionHeading title="Our proposed solution" />
        <Prose>
          <p>
            Vryanta aims to connect people with relevant opportunities using profile-based matching. You describe
            your education, qualification, skills, languages, interests and preferences once. Every opportunity is
            then scored against that profile and shown with a plain explanation of why it matched.
          </p>
          <p>
            Today that scoring is a transparent, rule-based comparison — no black box, no claims about artificial
            intelligence we haven't built. It's designed so a real recommendation engine can be connected later
            without changing how the product feels.
          </p>
        </Prose>
      </section>

      <section className="mt-12">
        <SectionHeading
          title="Where we are right now"
          description="Being straight about this matters more to us than looking bigger than we are."
        />
        <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
          {[
            "Vryanta is an early-stage prototype, not an established marketplace.",
            "We have no user counts, partnerships or testimonials to show yet — so we don't invent any.",
            "Some opportunities on the platform are sample listings, and each one is labelled as a demo opportunity.",
            "Employer verification does not exist yet, so we never describe a listing as verified.",
          ].map((item) => (
            <li key={item} className="flex gap-3 rounded-lg border border-border bg-card p-4">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <SectionHeading
          eyebrow="Future vision"
          title="What we plan to build"
          description="Everything below is a plan, not a live feature."
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <InfoCard icon={<Sparkles className="size-5" />} title="AI-powered recommendations" badge="Planned">
            Learn from real application outcomes to improve which opportunities surface first.
          </InfoCard>
          <InfoCard icon={<Wrench className="size-5" />} title="Better qualification matching" badge="Planned">
            A structured map of Indian degrees, streams and eligibility rules.
          </InfoCard>
          <InfoCard icon={<ShieldCheck className="size-5" />} title="Verified opportunities" badge="Planned">
            Employer verification so genuine listings can be marked with confidence.
          </InfoCard>
          <InfoCard icon={<Bell className="size-5" />} title="Employer tools" badge="Planned">
            Applicant pipelines, notes, shortlisting and interview scheduling.
          </InfoCard>
          <InfoCard icon={<Smartphone className="size-5" />} title="Mobile application" badge="Planned">
            Apply, save and track opportunities from your phone.
          </InfoCard>
          <InfoCard icon={<Compass className="size-5" />} title="Career guidance" badge="Planned">
            Skill-gap suggestions for the roles you actually want.
          </InfoCard>
          <InfoCard icon={<Database className="size-5" />} title="Data-driven matching" badge="Planned">
            Use anonymised outcomes to make match scores more honest over time.
          </InfoCard>
        </div>
      </section>

      <section className="mt-12 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Want to help shape it?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Feedback from students, freshers and hiring teams is what moves this forward.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Get in touch
          </Link>
          <Link to="/how-it-works" className="rounded-lg border border-input px-4 py-2.5 text-sm font-semibold hover:bg-secondary">
            See how it works
          </Link>
        </div>
      </section>
    </MarketingPage>
  );
}
