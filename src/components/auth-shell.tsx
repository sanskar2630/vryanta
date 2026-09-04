import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import logoAsset from "@/assets/vryanta-logo.png.asset.json";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="surface-navy min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-5 py-12">
        <Link to="/" className="mx-auto flex items-center gap-2">
          <img src={logoAsset.url} alt="Vryanta logo" className="size-9 rounded-lg object-cover" />
          <span className="font-display text-lg font-semibold tracking-tight">Vryanta</span>
        </Link>

        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-2xl sm:p-8">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
          <div className="mt-6">{children}</div>
        </div>

        {footer ? <div className="mt-6 text-center text-sm text-navy-foreground/80">{footer}</div> : null}
      </div>
    </div>
  );
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="mb-1.5 block text-sm font-medium">{children}</span>;
}

export const inputClass =
  "w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm outline-none fluid placeholder:text-muted-foreground focus:border-accent";

export const primaryButtonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground fluid hover:opacity-90 disabled:opacity-60";
