import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, MessageSquare } from "lucide-react";
import { MarketingPage, SectionHeading } from "@/components/marketing";
import { PrototypeNote } from "@/components/prototype";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Vryanta — Send feedback or ask a question" },
      {
        name: "description",
        content:
          "Questions, feedback or interest in posting opportunities? Send the Vryanta team a message and we'll get back to you.",
      },
      { property: "og:title", content: "Contact Vryanta — Send feedback or ask a question" },
      { property: "og:description", content: "Send the Vryanta team feedback, questions or hiring enquiries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const topics = ["General question", "Feedback on the product", "I want to post opportunities", "Partnership or press"];

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", topic: topics[0]!, message: "" });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (form.message.trim().length < 10) {
      toast.error("Please add a little more detail to your message.");
      return;
    }
    setSent(true);
    toast.success("Message noted", { description: "Messaging is UI-only in the prototype." });
  }

  return (
    <MarketingPage
      eyebrow="Contact"
      title="Talk to the people building Vryanta"
      intro="We read everything. Feedback from students, freshers and hiring teams is what decides what gets built next."
    >
      {sent ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent/12 text-accent">
            <Mail className="size-5" />
          </span>
          <h2 className="mt-4 font-display text-lg font-semibold">Thanks, {form.name.split(" ")[0] || "there"}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Your message has been captured in the prototype UI. Once our inbox integration ships, messages sent from
            this form will reach the team directly.
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="mt-6 rounded-lg border border-input px-4 py-2.5 text-sm font-semibold hover:bg-secondary"
          >
            Send another message
          </button>
        </div>
      ) : (
        <>
          <SectionHeading title="Send a message" description="Tell us who you are and what you need." />
          <form onSubmit={submit} className="mt-6 grid gap-5 rounded-xl border border-border bg-card p-6 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Your name</span>
              <input
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Aarav Sharma"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium">Topic</span>
              <select
                value={form.topic}
                onChange={(event) => setForm((prev) => ({ ...prev, topic: event.target.value }))}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium">Message</span>
              <textarea
                required
                rows={5}
                maxLength={1000}
                value={form.message}
                onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))}
                placeholder="What's on your mind?"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="mt-1 block text-xs text-muted-foreground">{form.message.length}/1000</span>
            </label>
            <div className="sm:col-span-2">
              <PrototypeNote>
                This form is UI-only for now. Nothing is emailed yet — we'll connect a real inbox before launch.
              </PrototypeNote>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:col-span-2 sm:w-fit"
            >
              <MessageSquare className="size-4" />
              Send message
            </button>
          </form>
        </>
      )}
    </MarketingPage>
  );
}
