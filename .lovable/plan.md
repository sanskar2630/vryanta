# Step 1 — Visual foundation in `src/styles.css` only

Scope is this single file. No components, routes, hooks, auth, backend, copy, or dependencies are touched. After this lands I stop for your review before navigation, hero, or anything else.

## What changes

- **Dark by default**: the premium dark palette becomes the `:root` values, no theme toggle. The `.dark` class is kept only so shadcn `dark:` utilities stay valid.
- **Surfaces**: near-black navy background, with layered elevated tokens for card, popover, secondary, muted and sidebar so panels read as stacked depth rather than flat blocks.
- **Accent system**: blue primary, violet secondary (new `--violet` token), cyan highlight on `--accent`. Chart tokens realigned to the same three hues.
- **Token mapping preserved**: every existing semantic token (`background`, `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `border`, `input`, `ring`, sidebar, plus the project's `navy`/`teal` tokens) keeps its name and `@theme inline` mapping, so all current pages inherit the new look with zero component edits.
- **New reusable utilities**: `gradient-border`, `ambient-glow`, refined `glass-panel`, `btn-gradient`, `section-divider`, `text-gradient`.
- **`depth-field` enhanced**: soft radial aurora (blue/violet/cyan) plus a subtle masked grid, keeping the existing pointer-parallax variables.
- **Typography and rhythm**: same Sora/Manrope fonts, tightened heading letter-spacing and line-height, balanced/pretty text wrapping, body line-height set for readability, radius raised to `0.9rem`, and softer layered card/lift shadows.
- Contrast kept accessible: light foreground on dark surfaces, `muted-foreground` lifted so secondary text stays legible.

## Verification

Build check plus a quick look at the preview to confirm no contrast or layout regressions. No new animations beyond the existing keyframes, and `prefers-reduced-motion` handling stays in place.
