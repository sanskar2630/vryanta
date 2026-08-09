import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage, Prose, SectionHeading } from "@/components/marketing";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Vryanta" },
      {
        name: "description",
        content:
          "The ground rules for using Vryanta during its prototype phase, for both job seekers and employers.",
      },
      { property: "og:title", content: "Terms of Use — Vryanta" },
      { property: "og:description", content: "Ground rules for using Vryanta during its prototype phase." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <MarketingPage
      eyebrow="Terms"
      title="Using Vryanta during the prototype"
      intro="Short and readable, because there's no benefit in hiding the important parts."
    >
      <section>
        <SectionHeading title="Service status" />
        <Prose>
          <p>
            Vryanta is an early-stage prototype provided as-is. Features may change or be removed, and we can't
            guarantee uptime, data retention or that an opportunity you see is still open.
          </p>
        </Prose>
      </section>

      <section className="mt-10">
        <SectionHeading title="If you're a job seeker" />
        <Prose>
          <ul className="list-disc space-y-2 pl-5">
            <li>Provide information about yourself that is accurate.</li>
            <li>Verify an organisation independently before sharing documents or attending an interview.</li>
            <li>Never pay money to apply for an opportunity, and report anyone who asks.</li>
            <li>Applications you submit are shared with the employer who posted the vacancy.</li>
          </ul>
        </Prose>
      </section>

      <section className="mt-10">
        <SectionHeading title="If you're an employer" />
        <Prose>
          <ul className="list-disc space-y-2 pl-5">
            <li>Post real openings with accurate qualification, pay and location details.</li>
            <li>Don't charge candidates any fee for applying, training or onboarding.</li>
            <li>Use applicant data only to evaluate people for the role they applied to.</li>
            <li>We may remove any listing that appears misleading or unsafe.</li>
          </ul>
        </Prose>
      </section>

      <section className="mt-10">
        <SectionHeading title="Sample content" />
        <Prose>
          <p>
            Some opportunities on Vryanta are sample listings created to demonstrate the product. They're labelled
            as demo opportunities and use fictional organisations. Their appearance does not imply any partnership.
          </p>
        </Prose>
      </section>
    </MarketingPage>
  );
}
