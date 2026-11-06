'use client';
import { Suspense, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { isPlan, PLANS, type AccountType } from '@/lib/vault/catalog';
import { vaultClient } from '@/lib/vault/browser';

function SignupForm() {
  const params = useSearchParams();
  const router = useRouter();
  const queryPlan = params.get('plan');
  const [plan, setPlan] = useState(isPlan(queryPlan) ? queryPlan : 'starter');
  const [accountType, setAccountType] = useState<AccountType>('adult_athlete');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!confirmed) { setError('Please confirm the account eligibility and guardian requirement.'); return; }
    setBusy(true); setError('');
    try {
      const { data, error: signupError } = await vaultClient().auth.signUp({
        email: email.trim(), password,
        options: {
          emailRedirectTo: `${window.location.origin}/portal/auth/callback`,
          data: { vault_plan: plan, vault_account_type: accountType }
        }
      });
      if (signupError) throw signupError;
      if (data.session) router.replace('/portal/onboarding');
      else router.replace('/portal/check-email');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not create your account.'); }
    finally { setBusy(false); }
  }

  return <main className="vault-main">
    <div className="vault-form-card vault-card">
      <div className="vault-eyebrow">CREATE YOUR ACCOUNT</div>
      <h1>Join The Vault.</h1>
      <p className="vault-subtle">Get your athlete workspace ready in a few guided steps.</p>
      <form onSubmit={submit}>
        <label className="vault-label" htmlFor="vault-plan">Membership selection</label>
        <select className="vault-input" id="vault-plan" value={plan} onChange={e => setPlan(e.target.value as typeof plan)}>
          {(['starter', 'pro', 'elite'] as const).map(name => <option key={name} value={name}>{PLANS[name].title} — ${PLANS[name].monthlyPrice}/month</option>)}
        </select>
        <p className="vault-subtle vault-small">You are selecting a package, not authorizing a charge. Payment activation will be added before launch.</p>
        <label className="vault-label" htmlFor="vault-owner">Who will manage this account?</label>
        <select className="vault-input" id="vault-owner" value={accountType} onChange={e => setAccountType(e.target.value as AccountType)}>
          <option value="adult_athlete">Athlete age 18 or older</option>
          <option value="guardian">Parent / legal guardian</option>
        </select>
        <label className="vault-label" htmlFor="vault-signup-email">Email</label>
        <input className="vault-input" id="vault-signup-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
        <label className="vault-label" htmlFor="vault-signup-password">Password</label>
        <input className="vault-input" id="vault-signup-password" type="password" minLength={8} autoComplete="new-password" required value={password} onChange={e => setPassword(e.target.value)} />
        <label className="vault-inline vault-subtle vault-small" style={{ margin: '18px 0' }}>
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />
          <span>I am at least 18 and, if creating a profile for a minor, I am their parent or legal guardian.</span>
        </label>
        {error && <p className="vault-error" role="alert">{error}</p>}
        <button className="vault-button vault-button-gold vault-full" type="submit" disabled={busy}>{busy ? 'Creating account…' : 'Create account →'}</button>
      </form>
      <p className="vault-subtle vault-small" style={{ marginTop: 20 }}>Already have an account? <Link className="vault-link" href="/portal/login">Sign in</Link>.</p>
    </div>
  </main>;
}
export default function SignupPage() { return <Suspense fallback={<main className="vault-main">Loading signup…</main>}><SignupForm /></Suspense>; }
