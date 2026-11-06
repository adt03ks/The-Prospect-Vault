import Link from 'next/link';
export default function CheckEmail() {
  return <main className="vault-main"><section className="vault-form-card vault-card">
    <div className="vault-eyebrow">ONE MORE STEP</div><h1>Check your email.</h1>
    <p className="vault-subtle">If email confirmation is enabled in Supabase, open the confirmation message sent to your address. After confirming, you will enter your athlete setup wizard.</p>
    <Link href="/portal/login" className="vault-button vault-button-gold">Go to sign in →</Link>
  </section></main>;
}
