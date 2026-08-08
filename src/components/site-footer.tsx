import { Link } from "@tanstack/react-router";
import { categories } from "@/data/jobs";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/50">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-12 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-display text-base font-semibold">Vryanta</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            A free job board for unemployed students and scholars. Browse verified vacancies by category and apply
            directly — no subscription, no placement fee.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Popular categories</p>
          <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            {categories.slice(0, 6).map((category) => (
              <li key={category.slug}>
                <Link
                  to="/jobs"
                  search={{ category: category.slug }}
                  className="transition-colors hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70 px-5 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Vryanta. Built for scholars looking for their first opportunity.
      </div>
    </footer>
  );
}
