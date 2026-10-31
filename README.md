# The Prospect Vault — starter repository

Next.js + Supabase starter for family accounts and athlete profiles.

## Start
1. Create a **new** private GitHub repository and copy these files into it.
2. Install Node.js 20+ and run `npm install`.
3. Create a **new** Supabase project. Run `supabase/migrations/001_initial.sql` in its SQL editor.
4. Copy `.env.example` to `.env.local`, enter your Supabase project URL and publishable/anon key. Never put the service-role key in browser environment variables.
5. In Supabase Authentication > Providers, enable Email and configure confirmation and redirect URLs.
6. Run `npm run dev` and open `http://localhost:3000`.
7. Create an account, confirm the email, sign in, add an athlete, update the biography, and add a YouTube/Vimeo link.

## Important: development-only boundaries
- No Stripe integration or paid-tier enforcement yet. All new athletes are Starter, and users cannot edit tier values. Do **not** collect payments or promise paid features until Stripe webhooks and server-side limits are implemented.
- Profiles remain unpublished by design. Public profile access and photo delivery are intentionally disabled until consent, moderation, and safe public-data projections are implemented. The public athlete route will show 404 for unpublished profiles.
- Photo uploads go into a private storage bucket; no public URL will work until a reviewed publishing workflow is added.
- This MVP assumes the account owner is an adult. Implement verifiable guardian consent, authorization for multiple adults, minor privacy, and deletion before launch.
- The client photo limit is convenience only; bucket-level file size and MIME restrictions are also configured. Add content validation, upload quotas, malware scanning, and moderation before launch.
- Authenticated browser sessions require a proper Supabase SSR middleware/proxy refresh flow before production.
- Add rate limiting, abuse prevention, tests, monitoring, and a custom-domain strategy.
- `app/dashboard/widgets.tsx` is a starting point, not a production-grade content management interface.

## Next milestones
1. Implement server-side tier entitlements and Stripe Checkout + signed webhook processing.
2. Add `households`, `household_members`, `athlete_guardians`, `consents`, and immutable audit logs.
3. Build reviewed public profile publishing and privacy-safe image delivery.
4. Implement per-athlete photo/video quotas, file deletion, and structured athletic metrics.
5. Add NIL media kits and private brand inquiry workflows.
