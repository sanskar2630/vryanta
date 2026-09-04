import { useState, type ReactNode } from "react";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { inputClass } from "@/components/auth-shell";
import { cn } from "@/lib/utils";

/** A titled card used for every profile / resume section. */
export function SectionCard({
  title,
  description,
  action,
  children,
  id,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  className,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={Boolean(error)}
        className={cn(inputClass, error && "border-destructive")}
      />
      {error ? <span className="mt-1 block text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium">{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(inputClass, "resize-y")}
      />
      {hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className={inputClass}>
        <option value="">Not specified</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Chip editor backed by a string array — keeps skills structured, never a text blob. */
export function TagInput({
  label,
  values,
  onChange,
  placeholder = "Type and press Enter",
  hint,
  className,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  hint?: string;
  className?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const parts = raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...values];
    for (const part of parts) {
      if (!next.some((existing) => existing.toLowerCase() === part.toLowerCase())) next.push(part);
    }
    onChange(next);
    setDraft("");
  }

  return (
    <div className={cn("block", className)}>
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium"
          >
            {value}
            <button
              type="button"
              aria-label={`Remove ${value}`}
              onClick={() => onChange(values.filter((item) => item !== value))}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        {values.length === 0 ? <span className="text-xs text-muted-foreground">Nothing added yet.</span> : null}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              commit(draft);
            }
          }}
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => commit(draft)}
          className="shrink-0 rounded-lg border border-input px-3 text-sm font-semibold hover:bg-secondary"
        >
          <Plus className="size-4" />
        </button>
      </div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function SaveButton({ saving, children = "Save" }: { saving?: boolean; children?: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
    >
      {saving ? <Loader2 className="size-4 animate-spin" /> : null}
      {saving ? "Saving…" : children}
    </button>
  );
}

export function EntryRow({
  title,
  subtitle,
  meta,
  body,
  onDelete,
  deleting,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  body?: string | null;
  onDelete: () => void;
  deleting?: boolean;
}) {
  return (
    <li className="rounded-lg border border-border/70 bg-background/40 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold leading-snug">{title}</p>
          {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          {meta ? <p className="mt-0.5 text-xs text-muted-foreground">{meta}</p> : null}
        </div>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          aria-label={`Delete ${title}`}
          className="shrink-0 rounded-lg border border-input p-2 text-muted-foreground transition-colors hover:border-destructive hover:text-destructive disabled:opacity-50"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      {body ? <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{body}</p> : null}
    </li>
  );
}

export function EmptyRow({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function isValidUrl(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    return Boolean(url.hostname.includes("."));
  } catch {
    return false;
  }
}

export function normalizeUrl(value: string) {
  const clean = value.trim();
  if (!clean) return null;
  return clean.startsWith("http") ? clean : `https://${clean}`;
}
