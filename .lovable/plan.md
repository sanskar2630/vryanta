# Vryanta Visual Redesign — Futuristic AI Career Platform

A UI/UX-only transformation. No routes removed, no auth/database/logic changes.

## 1. New design foundation (dark-first)

Today the app renders a light "Ocean Deep" theme (`src/styles.css`), with the dark token block present but never activated. The redesign makes the premium dark theme the default look of the product.

- Recolor tokens: near-black navy base, layered elevated surfaces, and a controlled accent trio — blue (primary), violet (secondary accent), cyan (highlight).
- Ambient system: two or three reusable tokens for gradient borders, ambient glow, and glass panels so effects stay consistent instead of ad-hoc.
- Background texture: one subtle grid + soft radial aurora treatment reused across page shells (extends existing `depth-field`).
- Keep Sora/Manrope, tighten the type scale and spacing rhythm for a more premium hierarchy.
- All existing shadcn/semantic tokens stay mapped, so every current page inherits the new look immediately.

## 2. Navigation

Rebuild `site-header` presentation only (same links, same session logic):
- Floating translucent bar that gains blur/border/shadow after scroll.
- Underline-slide hover states, gradient-bordered primary CTA.
- Mobile: full-height sheet-style panel with staggered link reveal.

## 3. Homepage

- **Hero**: keep the pointer-parallax depth field, upgrade to a taller cinematic layout — gradient headline, supporting line, primary + ghost CTA, and a refined right-side "match engine" visual (profile → skills → AI core → opportunities) with animated connective lines and floating opportunity cards.
- **Trust strip**: compact stat row with count-up numbers, prototype/demo labelling preserved.
- **Problem section**: asymmetric two-column with accent-bordered callouts.
- **How it works**: convert the 4-step walkthrough into a vertical timeline with scroll-activated nodes.
- **Why Vryanta**: bento grid (one large feature tile + smaller supporting tiles) replacing the uniform card row.
- **Roadmap + CTA**: horizontal phase rail, then a glow-framed closing CTA with magnetic buttons.
- Section transitions via gradient dividers rather than hard color breaks.

## 4. Dashboard and authenticated shell

- `app-shell`: darker sidebar/topbar with active-route indicator, refined notification bell, better mobile drawer.
- Dashboard: hero greeting row, profile-completion ring, animated stat tiles, match-insight cards with score rings, skills coverage bars, and an application progress timeline.
- Empty states get illustrated, well-composed placeholders instead of bare text.
- Any purely visual placeholder for future features is explicitly labelled as coming soon — no fake data or fake actions.

## 5. Remaining pages (visual pass, same content)

Jobs list/detail, find-jobs, applications, saved, alerts, profile, resume, settings, employer suite, auth screens, and marketing pages (`about`, `how-it-works`, `for-employers`, `contact`, legal) all move to the shared new card/panel/typography primitives so nothing looks left behind.

## 6. Motion, responsiveness, performance

- Reuse the existing `motion.tsx` primitives (`Reveal`, `CountUp`, `ScoreRing`, `Magnetic`, `Tilt`) — no new animation dependency.
- CSS transform/opacity animations only; hover elevation, button press, gradient shimmer on key surfaces.
- `prefers-reduced-motion` respected throughout; custom cursor stays desktop-only.
- Grid-based header rows with `min-w-0`/`truncate`, verified at mobile, tablet, laptop, desktop widths.

## Technical notes

- Token work in `src/styles.css` (Tailwind v4 `@theme inline` + `@utility`); dark palette applied at `:root` so no theme toggle is required.
- Component-level edits only in `src/components/*` and `src/routes/*` presentation markup; hooks in `src/hooks/use-vryanta.ts`, `src/lib/*`, and all Supabase integration files untouched.
- No hardcoded color utilities — everything through semantic tokens.
- Verified after implementation with a build check and Playwright screenshots at mobile and desktop widths.
