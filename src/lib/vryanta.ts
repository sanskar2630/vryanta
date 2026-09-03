import { jobs as curatedJobs } from "@/data/jobs";

export type UnifiedJob = {
  ref: string;
  jobId: string | null;
  title: string;
  company: string;
  category: string;
  location: string;
  type: string;
  workMode: string;
  stipend: string;
  qualification: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  posted: string;
  source: "curated" | "employer";
};

export type ProfileRow = {
  id: string;
  full_name: string;
  email: string;
  headline: string | null;
  about: string | null;
  location: string | null;
  phone: string | null;
  avatar_url: string | null;
  account_type: string;
  visibility: string;
  skills: string[];
  languages: unknown;
  desired_titles: string[];
  preferred_locations: string[];
  expected_salary: string | null;
  work_modes: string[];
  job_types: string[];
  is_fresher: boolean;
  interests: string[];
  experience_level: string | null;
  onboarding_completed: boolean;
  resume_url: string | null;
  company_name: string | null;
  company_type: string | null;
  company_website: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  soft_skills: string[];
  notify_job_alerts: boolean;
  notify_application_updates: boolean;
  notify_employer_messages: boolean;
};

export type LanguageEntry = { name: string; proficiency: string };

export function parseLanguages(value: unknown): LanguageEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (item && typeof item === "object" && "name" in item) {
      const entry = item as { name?: unknown; proficiency?: unknown };
      if (typeof entry.name !== "string") return [];
      return [{ name: entry.name, proficiency: typeof entry.proficiency === "string" ? entry.proficiency : "" }];
    }
    return [];
  });
}

export const curatedUnifiedJobs: UnifiedJob[] = curatedJobs.map((job) => ({
  ref: `curated:${job.id}`,
  jobId: null,
  title: job.title,
  company: job.company,
  category: job.category,
  location: job.location,
  type: job.type,
  workMode: job.location.toLowerCase().includes("remote") ? "Remote" : "On-site",
  stipend: job.stipend,
  qualification: job.qualification,
  summary: job.summary,
  responsibilities: job.responsibilities,
  requirements: job.requirements,
  skills: [],
  posted: job.posted,
  source: "curated",
}));

export type EmployerJobRow = {
  id: string;
  title: string;
  company: string;
  category: string;
  location: string;
  job_type: string;
  work_mode: string;
  stipend: string | null;
  qualification: string | null;
  summary: string | null;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  created_at: string;
};

export function employerJobToUnified(row: EmployerJobRow): UnifiedJob {
  return {
    ref: `job:${row.id}`,
    jobId: row.id,
    title: row.title,
    company: row.company,
    category: row.category,
    location: row.location,
    type: row.job_type,
    workMode: row.work_mode,
    stipend: row.stipend ?? "Not disclosed",
    qualification: row.qualification ?? "Open to freshers",
    summary: row.summary ?? "",
    responsibilities: row.responsibilities ?? [],
    requirements: row.requirements ?? [],
    skills: row.skills ?? [],
    posted: new Date(row.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    source: "employer",
  };
}

const norm = (value: string) => value.toLowerCase().trim();

export type ScoreProfile = Pick<
  ProfileRow,
  | "skills"
  | "desired_titles"
  | "preferred_locations"
  | "work_modes"
  | "job_types"
  | "location"
  | "headline"
  | "interests"
  | "experience_level"
>;

/** Deterministic, rule-based match score between a seeker profile and a job. */
export function matchScore(profile: Partial<ScoreProfile> | null | undefined, job: UnifiedJob): number {
  if (!profile) return 60;
  let score = 50;
  const haystack = norm(`${job.title} ${job.summary} ${job.requirements.join(" ")} ${job.skills.join(" ")} ${job.qualification}`);

  const skills = (profile.skills ?? []).filter(Boolean);
  const skillHits = skills.filter((skill) => haystack.includes(norm(skill))).length;
  score += Math.min(skillHits, 4) * 6;

  const titleHit = (profile.desired_titles ?? []).some(
    (title) => title && (haystack.includes(norm(title)) || norm(job.title).includes(norm(title))),
  );
  if (titleHit) score += 12;

  const locations = [...(profile.preferred_locations ?? []), profile.location ?? ""].filter(Boolean);
  if (locations.some((loc) => norm(job.location).includes(norm(loc)) || norm(loc).includes(norm(job.location)))) {
    score += 8;
  }
  if ((profile.job_types ?? []).some((type) => norm(type) === norm(job.type))) score += 7;
  if ((profile.work_modes ?? []).some((mode) => norm(mode) === norm(job.workMode))) score += 5;
  if ((profile.interests ?? []).some((interest) => interest && (haystack.includes(norm(interest)) || norm(job.category).includes(norm(interest))))) {
    score += 6;
  }
  if (profile.headline && haystack.includes(norm(profile.headline.split("|")[0] ?? ""))) score += 4;

  return Math.max(48, Math.min(99, score));
}

export type CompletionItem = { label: string; done: boolean; hint: string; weight: number; to: string };

/**
 * Weighted profile completion. Sections that drive job matching (education, skills,
 * experience, preferences) count for more than optional extras like links.
 */
export function profileCompletion(input: {
  profile: ProfileRow | null | undefined;
  educationCount: number;
  experienceCount: number;
  certificationCount: number;
  projectCount?: number;
}): { percent: number; items: CompletionItem[]; suggestions: CompletionItem[] } {
  const p = input.profile;
  const items: CompletionItem[] = [
    {
      label: "Basic information",
      done: Boolean(p?.full_name && p?.location && p?.phone),
      hint: "Name, location and phone number",
      weight: 14,
      to: "/profile",
    },
    {
      label: "Professional headline",
      done: Boolean(p?.headline),
      hint: "e.g. Customer Support Executive | Fresher",
      weight: 8,
      to: "/profile",
    },
    {
      label: "About summary",
      done: Boolean(p?.about && p.about.length > 30),
      hint: "A short professional summary",
      weight: 10,
      to: "/profile",
    },
    {
      label: "Education",
      done: input.educationCount > 0,
      hint: "Complete your education details",
      weight: 14,
      to: "/profile",
    },
    {
      label: "Skills",
      done: (p?.skills?.length ?? 0) >= 3,
      hint: "Add at least 3 technical skills",
      weight: 14,
      to: "/profile",
    },
    {
      label: "Work experience",
      done: input.experienceCount > 0 || Boolean(p?.is_fresher),
      hint: "Add a role, or mark yourself as a fresher",
      weight: 10,
      to: "/profile",
    },
    {
      label: "Projects",
      done: (input.projectCount ?? 0) > 0,
      hint: "Add your projects to improve your profile",
      weight: 9,
      to: "/profile",
    },
    {
      label: "Certifications & achievements",
      done: input.certificationCount > 0,
      hint: "Courses, certificates or awards you hold",
      weight: 5,
      to: "/profile",
    },
    {
      label: "Career preferences",
      done: (p?.desired_titles?.length ?? 0) > 0 && (p?.job_types?.length ?? 0) > 0,
      hint: "Desired roles, job type and work mode",
      weight: 9,
      to: "/profile",
    },
    {
      label: "Professional links",
      done: Boolean(p?.linkedin_url || p?.github_url || p?.portfolio_url),
      hint: "Add your LinkedIn, GitHub or portfolio",
      weight: 4,
      to: "/profile",
    },
    {
      label: "Languages",
      done: parseLanguages(p?.languages).length > 0,
      hint: "Languages you speak",
      weight: 3,
      to: "/profile",
    },
  ];
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  const earned = items.filter((item) => item.done).reduce((sum, item) => sum + item.weight, 0);
  const suggestions = items.filter((item) => !item.done).sort((a, b) => b.weight - a.weight);
  return { percent: Math.round((earned / total) * 100), items, suggestions };
}


export function initialsOf(name: string | null | undefined, fallback = "V") {
  const clean = (name ?? "").trim();
  if (!clean) return fallback;
  const parts = clean.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || fallback;
}

export function greetingFor(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
