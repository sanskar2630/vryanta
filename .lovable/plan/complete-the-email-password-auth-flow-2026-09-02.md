# Complete the email/password auth flow

Inspection first: most of this already exists and will be reused, not rebuilt.

## Already in place (no duplication)

- Signup with email + password (role selection, "check your email" confirmation state)
- Login with email + password, "forgot password" link
- Forgot-password page that sends the reset email
- Logout that clears the session (account menu + settings page)
- Session persistence via the built-in Supabase session storage
- Protected routing: every page under the authenticated area redirects signed-out visitors to the login page
- Database: `profiles` table keyed to the auth user, row-level security limiting reads/writes to the owner, and a trigger that creates the profile row on signup
- A placeholder-free profile page already exists

## Actual gaps to fix

1. **Missing "set a new password" page.** The forgot-password email points to `/reset-password`, but that page does not exist — clicking the link lands on a 404 and the user gets silently signed in without changing anything. Add it: verify the recovery session, collect a new password twice, save it, then send the user to the dashboard. Public route, no auth gate.

2. **Short URLs `/login` and `/signup`.** Today they live under `/auth/...`. Add `/login` and `/signup` routes that render the same pages so both paths work, keeping existing links intact.

3. **Signed-in users landing on login/signup.** Add a redirect so an already-authenticated visitor on the login or signup page goes straight to the dashboard.

4. **Email-confirmation gating.** Make the authenticated area require a confirmed email address: an unconfirmed account is bounced back to a "check your email" screen instead of reaching the dashboard.

## Out of scope (per your instructions)

No Google/OAuth work, no AI features, no new tables or columns, no visual redesign — only the minimum markup needed for the new password form.

## Technical notes

- New public route file for `/reset-password` (client-only), reading the recovery session and calling the password update.
- New thin route files for `/login` and `/signup` re-exporting the existing page components; both gain a signed-in redirect, matching the pattern used by the existing auth index route.
- Email-confirmation check added to the existing authenticated layout guard (it already calls `getUser()`, so the confirmation timestamp is available there — no extra request).
- No database migration required; schema, policies and trigger already match the spec. RLS will be verified with a read-only query.

## Verification

Browser run-through of signup → confirmation gate → login → logout → reset password → protected redirects → refresh persistence, plus a check that row-level security is active on `profiles`.
