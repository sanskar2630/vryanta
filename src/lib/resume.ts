import type { ProfileRow } from "@/lib/vryanta";
import { parseLanguages } from "@/lib/vryanta";

export type EducationRow = {
  id: string;
  degree: string;
  institution: string;
  field: string | null;
  start_year: string | null;
  end_year: string | null;
  grade: string | null;
};

export type ExperienceRow = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  employment_type?: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
};

export type ProjectRow = {
  id: string;
  name: string;
  description: string | null;
  technologies: string[];
  project_url: string | null;
  repo_url: string | null;
};

export type CertificationRow = {
  id: string;
  name: string;
  issuer: string | null;
  issue_date: string | null;
  credential_url: string | null;
};

export type ResumeSections = {
  education: EducationRow[];
  experience: ExperienceRow[];
  certifications: CertificationRow[];
  projects: ProjectRow[];
};

export type ResumeRow = {
  id: string;
  user_id: string;
  title: string;
  summary: string | null;
  overrides: unknown;
  settings: unknown;
  updated_at: string;
};

/**
 * Resume customisations are stored as a flat map of `text` overrides keyed by
 * `<section>:<row id>:<field>`, plus a list of hidden row ids. Nothing here ever
 * writes back to the profile, so a resume edit cannot destroy profile data.
 */
export type ResumeOverrides = {
  text: Record<string, string>;
  hidden: string[];
};

export function parseOverrides(value: unknown): ResumeOverrides {
  const raw = (value ?? {}) as { text?: unknown; hidden?: unknown };
  const text: Record<string, string> = {};
  if (raw.text && typeof raw.text === "object") {
    for (const [key, entry] of Object.entries(raw.text as Record<string, unknown>)) {
      if (typeof entry === "string") text[key] = entry;
    }
  }
  const hidden = Array.isArray(raw.hidden) ? raw.hidden.filter((item): item is string => typeof item === "string") : [];
  return { text, hidden };
}

export function overrideKey(section: string, id: string, field: string) {
  return `${section}:${id}:${field}`;
}

export type ResumeDocument = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  links: { label: string; url: string }[];
  summary: string;
  education: EducationRow[];
  experience: ExperienceRow[];
  projects: ProjectRow[];
  certifications: CertificationRow[];
  technicalSkills: string[];
  softSkills: string[];
  languages: string[];
};

const dateRange = (start: string | null, end: string | null, current?: boolean) =>
  [start || "", current ? "Present" : end || ""].filter(Boolean).join(" – ");

export { dateRange };

/** Merge profile data with resume-specific overrides into a print-ready document. */
export function buildResumeDocument(input: {
  profile: ProfileRow | null | undefined;
  sections: ResumeSections | undefined;
  resume: ResumeRow | null | undefined;
}): ResumeDocument {
  const { profile, resume } = input;
  const sections = input.sections ?? { education: [], experience: [], certifications: [], projects: [] };
  const ov = parseOverrides(resume?.overrides);
  const hidden = new Set(ov.hidden);
  const pick = (section: string, id: string, field: string, fallback: string | null) => {
    const value = ov.text[overrideKey(section, id, field)];
    return value !== undefined && value !== "" ? value : (fallback ?? "");
  };

  const links: { label: string; url: string }[] = [];
  if (profile?.linkedin_url) links.push({ label: "LinkedIn", url: profile.linkedin_url });
  if (profile?.github_url) links.push({ label: "GitHub", url: profile.github_url });
  if (profile?.portfolio_url) links.push({ label: "Portfolio", url: profile.portfolio_url });

  return {
    name: pick("profile", "root", "name", profile?.full_name || "Your name"),
    headline: pick("profile", "root", "headline", profile?.headline ?? ""),
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    location: profile?.location ?? "",
    links,
    summary: resume?.summary?.trim() ? resume.summary : (profile?.about ?? ""),
    education: sections.education.filter((row) => !hidden.has(`education:${row.id}`)),
    experience: sections.experience
      .filter((row) => !hidden.has(`experience:${row.id}`))
      .map((row) => ({
        ...row,
        title: pick("experience", row.id, "title", row.title),
        description: pick("experience", row.id, "description", row.description),
      })),
    projects: sections.projects
      .filter((row) => !hidden.has(`projects:${row.id}`))
      .map((row) => ({
        ...row,
        name: pick("projects", row.id, "name", row.name),
        description: pick("projects", row.id, "description", row.description),
      })),
    certifications: sections.certifications.filter((row) => !hidden.has(`certifications:${row.id}`)),
    technicalSkills: profile?.skills ?? [],
    softSkills: profile?.soft_skills ?? [],
    languages: parseLanguages(profile?.languages).map((entry) =>
      entry.proficiency ? `${entry.name} (${entry.proficiency})` : entry.name,
    ),
  };
}

export function resumeIsReady(doc: ResumeDocument) {
  return Boolean(doc.name && doc.email && (doc.education.length > 0 || doc.experience.length > 0));
}
