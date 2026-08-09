import { createFileRoute } from "@tanstack/react-router";
import { MarketingPage, Prose, SectionHeading } from "@/components/marketing";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — How Vryanta handles your data" },
      {
        name: "description",
        content:
          "What Vryanta stores, who can see your profile, and how you stay in control of your data on the platform.",
      },
      { property: "og:title", content: "Privacy — How Vryanta handles your data" },
      { property: "og:description", content: "What Vryanta stores and who can see your profile." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <MarketingPage
      eyebrow="Privacy"
      title="Your profile, your call"
      intro="Vryanta is a prototype, so this page describes current behaviour in plain language rather than a finished legal policy."
    >
      <section>
        <SectionHeading title="What we store" />
        <Prose>
          <p>
            The information you enter yourself: name, email, phone, location, headline, about text, education,
            experience, certifications, skills, languages, interests and career preferences. We also store the
            opportunities you save and the applications you submit.
          </p>
        </Prose>
      </section>

      <section className="mt-10">
        <SectionHeading title="Who can see it" />
        <Prose>
          <p>
            Your account data is scoped to you. Employers can only see a job-seeker profile when its visibility is
            set to public, and they can only see applications submitted to their own vacancies.
          </p>
          <p>
            You can switch your profile visibility at any time from Settings. Your email and phone are never shown
            on a public page of the site.
          </p>
        </Prose>
      </section>

      <section className="mt-10">
        <SectionHeading title="What we don't do" />
        <Prose>
          <ul className="list-disc space-y-2 pl-5">
            <li>We don't sell your data.</li>
            <li>We don't send marketing email you didn't ask for.</li>
            <li>We don't share your profile with employers you haven't applied to unless it's set to public.</li>
            <li>We don't run advertising trackers on the platform.</li>
          </ul>
        </Prose>
      </section>

      <section className="mt-10">
        <SectionHeading title="Deleting your data" />
        <Prose>
          <p>
            You can clear or edit any section of your profile from the profile editor. For full account deletion
            during the prototype phase, contact us and we'll remove your records.
          </p>
        </Prose>
      </section>
    </MarketingPage>
  );
}
