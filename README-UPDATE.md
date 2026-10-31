# The Prospect Vault — Homepage Refresh

This update uses the supplied cinematic multicultural hero banner and the supplied official silver-and-gold logo.

## Files updated
- `app/page.tsx`: redesigned marketing homepage with real links, feature sections, sports, recruiting and NIL journeys.
- `app/layout.tsx`: shared branded navigation and footer.
- `app/styles.css`: responsive black/gold theme, accessible reduced-motion support and subtle shine animation.
- `lib/supabase/server.ts`: explicit cookie types (matches the previously resolved deployment error).

## New pages
- `app/athletes/page.tsx`
- `app/how-it-works/page.tsx`
- `app/memberships/page.tsx`
- `app/resources/page.tsx`
- `app/recruiting/page.tsx`
- `app/nil/page.tsx`

## New images
- `public/images/prospect-vault-hero.png`
- `public/images/prospect-vault-official-logo.png`

## Deployment
1. Back up your current GitHub repository or create a branch.
2. Copy the **contents** of this ZIP into the repository root, preserving folders. Commit to `main` to trigger Vercel.
3. Keep your existing Vercel environment variables; do not commit `.env.local`.
4. Test homepage, mobile layout, navigation, signup, login and dashboard on the Vercel deployment.

## Important limitations
- The hero banner is a supplied static image. Its baked-in text/buttons are decorative, not clickable. Working calls to action appear directly below it. A fully interactive recreation should eventually use separate athlete imagery and HTML text.
- Membership pricing is illustrative. Stripe billing, tier enforcement, public athlete directory and production publishing controls are **not** implemented.
- Existing signup/login/dashboard functionality is preserved from the starter project; do not publish minor profiles without consent, privacy review and access-control testing.
- If your live GitHub repository has been edited since the original starter ZIP, compare changes before replacing files.
