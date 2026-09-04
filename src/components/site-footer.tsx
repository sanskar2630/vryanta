import { Link } from "@tanstack/react-router";
import { categories } from "@/data/jobs";
import logoAsset from "@/assets/vryanta-logo.png.asset.json";

const columns = [
  {
    title: "Vryanta",
    links: [
      { to: "/about", label: "About" },
      { to: "/how-it-works", label: "How It Works" },
      { to: "/contact", label: "Contact" },
      { to: "/report", label: "Report an Issue" },
    ],
  },
  {
    title: "For job seekers",
    links: [
      { to: "/jobs", label: "Browse opportunities" },
      { to: "/auth/signup", label: "Create a profile" },
      { to: "/dashboard", label: "Your dashboard" },
    ],
  },
  {
    title: "For employers",
    links: [
      { to: "/for-employers", label: "Why Vryanta" },
      { to: "/post-job", label: "Post a vacancy" },
      { to: "/auth/signup", label: "Employer account" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/privacy", label: "Privacy" },
      { to: "/terms", label: "Terms" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/40">
      <div className="mx-auto w-full max-w-6xl px-5 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2.7fr]">
          <div>
            <div className="flex items-center gap-2">
              <img src={logoAsset.url} alt="Vryanta logo" className="size-8 rounded-md object-cover" />
              <p className="font-display text-base font-semibold">Vryanta</p>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              A future employment platform helping students, freshers and job seekers discover opportunities that
              match their qualifications, skills and location.
            </p>
            <p className="mt-4 inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              Vryanta is currently an early-stage prototype.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-semibold">{column.title}</p>
                <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="transition-colors hover:text-foreground">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-border/70 pt-6">
          <p className="text-sm font-semibold">Popular categories</p>
          <ul className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  to="/jobs"
                  search={{ category: category.slug }}
                  className="inline-flex rounded-full border border-border bg-background px-3 py-1 transition-colors hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/70 px-5 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Vryanta. Built so opportunity discovery is simpler for students and freshers.
      </div>
    </footer>
  );
}
