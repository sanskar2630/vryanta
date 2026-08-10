/**
 * Vryanta matching layer (prototype).
 *
 * This is a deterministic, rule-based scorer over the user's profile and a job.
 * It is intentionally isolated behind `matchDetails()` so a real recommendation
 * service (or an AI API) can replace the implementation later without touching
 * any UI code. Nothing here is AI — the UI must not claim otherwise.
 */
import { matchScore, type ScoreProfile, type UnifiedJob } from "@/lib/vryanta";

export type MatchDetails = {
  score: number;
  reasons: string[];
  summary: string;
};

const norm = (value: string) => value.toLowerCase().trim();

export type MatchProfile = Partial<ScoreProfile> | null | undefined;

export function matchDetails(profile: MatchProfile, job: UnifiedJob): MatchDetails {
  const score = matchScore(profile, job);
  const reasons: string[] = [];

  if (!profile) {
    return {
      score,
      reasons: [],
      summary: "Create a profile to see how well this opportunity matches you.",
    };
  }

  const haystack = norm(
    `${job.title} ${job.summary} ${job.requirements.join(" ")} ${job.skills.join(" ")} ${job.qualification}`,
  );

  const skillHits = (profile.skills ?? []).filter((skill) => skill && haystack.includes(norm(skill)));
  if (skillHits.length > 0) {
    reasons.push(`Matches ${skillHits.length} of your listed skills (${skillHits.slice(0, 3).join(", ")}).`);
  }

  const titleHit = (profile.desired_titles ?? []).find(
    (title) => title && (haystack.includes(norm(title)) || norm(job.title).includes(norm(title))),
  );
  if (titleHit) reasons.push(`Close to a role you're looking for: ${titleHit}.`);

  const locations = [...(profile.preferred_locations ?? []), profile.location ?? ""].filter(Boolean);
  const locationHit = locations.find(
    (loc) => norm(job.location).includes(norm(loc)) || norm(loc).includes(norm(job.location)),
  );
  if (locationHit) reasons.push(`Located in or near ${locationHit}.`);

  if ((profile.job_types ?? []).some((type) => norm(type) === norm(job.type))) {
    reasons.push(`It's a ${job.type} role, which is one of your preferences.`);
  }
  if ((profile.work_modes ?? []).some((mode) => norm(mode) === norm(job.workMode))) {
    reasons.push(`Work mode is ${job.workMode}, matching your preference.`);
  }

  const interestHit = (profile.interests ?? []).find(
    (interest) => interest && (haystack.includes(norm(interest)) || norm(job.category).includes(norm(interest))),
  );
  if (interestHit) reasons.push(`Overlaps a career interest you picked: ${interestHit}.`);

  if (profile.experience_level && profile.experience_level === experienceBand(job)) {
    reasons.push(`Suits your experience level (${profile.experience_level}).`);
  }

  const summary =
    reasons.length > 0
      ? reasons[0]!
      : "Based on your profile so far. Add skills and preferences to sharpen your matches.";

  return { score, reasons, summary };
}

/** Rough experience band inferred from the listing — used for filtering and reasons. */
export function experienceBand(job: Pick<UnifiedJob, "type" | "qualification" | "title">): string {
  const text = norm(`${job.qualification} ${job.title}`);
  if (job.type === "Internship" || text.includes("intern") || text.includes("trainee")) return "Student / Intern";
  if (text.includes("fresher") || text.includes("batch") || text.includes("no prior")) return "Fresher";
  if (text.includes("senior") || text.includes("lead") || text.includes("years")) return "Experienced";
  return "Fresher";
}

export const experienceBands = ["Student / Intern", "Fresher", "Experienced"] as const;

export const interestOptions = [
  "Teaching & academia",
  "Research",
  "Software & IT",
  "Data & analytics",
  "Finance & accounts",
  "Design & content",
  "Operations & admin",
  "Government & public sector",
  "Sales & marketing",
  "Social impact & NGO",
] as const;

export const workModeOptions = ["On-site", "Hybrid", "Remote"] as const;
export const jobTypeOptions = ["Full-time", "Part-time", "Internship", "Contract"] as const;
