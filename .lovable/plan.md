# Vryanta Visual Redesign — Futuristic AI Career Platform

UI/UX only. No auth, Supabase, hooks (`use-vryanta.ts`), `src/lib/*`, or route removals. No new dependencies — all motion reuses the existing `motion.tsx` primitives (`Reveal`, `CountUp`, `ScoreRing`, `Magnetic`, `Tilt`). The existing `CursorGlow` stays as-is; no new cursor work.

Work happens in strict priority order, verifying each stage before the next.

## Priority 1 — Foundation, navigation, hero

**Theme activation (`src/styles.css` only)**
- Make the dark palette the default at `:root` (no toggle). Today the app renders light and the dark block is never activated.
- Recolor: near-black navy base, layered elevated surfaces, three-color accent system — blue primary, violet secondary, cyan highlight.
- Add a small set of reusable opt-in utilities: `gradient-border`, `ambient-glow`, `glass-panel` (refined), `btn-gradient`, `section-divider`, `text-gradient`.
- Extend the existing `depth-field` with a subtle grid + soft radial aurora layer, reused globally instead of per page.
- Tighten the Sora/Manrope type scale, letter-spacing and radius rhythm. Same fonts.
- Because every page already routes through semantic tokens, this single change upgrades the whole app; verified with screenshots before touching other pages.

**Navigation (`site-header.tsx`, presentation only)**
- Floating translucent bar that gains blur/border/shadow after scroll.
- Underline-slide hover states (`nav-link`), gradient-bordered primary CTA.
- Mobile: sheet-style panel with staggered link reveal via `Reveal`.

**Hero + AI Match Engine visual (`routes/index.tsx`, `match-visual.tsx`)**
- Keep pointer-parallax `depth-field`; extend into a taller cinematic layout with gradient headline, supporting line, primary + ghost CTA.
- Right side: Profile → Skills → AI Core → Opportunities, connected by animated flow lines, with floating opportunity cards and `ScoreRing` score indicators, layered for depth with ambient glow and subtle pointer response.
- Transform/opacity animations only; `prefers-reduced-motion` respected.

## Priority 2 — Homepage sections (light touch)

- Trust/stat strip: inherit new tokens and spacing, `CountUp` numbers, demo labelling unchanged.
- "Why Vryanta": rebuilt as a bento grid (one large tile + smaller supporting tiles) — the only real structural change.
- Problem, How it works, Roadmap: restyle with new tokens, spacing and `section-divider` transitions; structural extras only where the existing `Reveal`/stagger primitives already allow it.
- Closing CTA: `gradient-border` + `ambient-glow` frame, `Magnetic` buttons.

## Priority 3 — Dashboard shell

- `app-shell.tsx`: darker topbar/nav surfaces, clear active-route indicator, refined notification bell, better mobile drawer.
- Dashboard home: greeting row, `ScoreRing`-based profile-completion and match-insight cards, `CountUp` stat tiles.
- Skills-coverage bars, application timelines and illustrated empty states are deferred — plain well-spaced placeholders for now.

## Priority 4 — Everything else

Jobs list/detail, find-jobs, applications, saved, alerts, profile, resume, settings, employer suite, auth screens, marketing/legal pages inherit the new look from the token and shared-component work. Individual files are touched only if something visibly breaks (contrast, spacing, truncation), fixed in isolation.

## Technical notes

- Tokens/utilities live only in `src/styles.css` (Tailwind v4 `@theme inline` + `@utility`).
- All other edits are presentation markup in `src/components/*` and `src/routes/*`.
- No hardcoded color utilities — semantic tokens only. Standard `backdrop-filter` only, no hand-written vendor prefixes.
- Verification: build check plus Playwright screenshots at mobile and desktop widths.
