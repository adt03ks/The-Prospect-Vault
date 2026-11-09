'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { vaultClient } from '@/lib/vault/browser';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setError('');
    const { error } = await vaultClient().auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) { setError(error.message); return; }
    router.replace('/portal/dashboard'); router.refresh();
  }
  return <main className="vault-main"><div className="vault-form-card vault-card">
    <div className="vault-eyebrow">MEMBER ACCESS</div><h1>Welcome back.</h1>
    <p className="vault-subtle">Sign in to continue building your athlete profile.</p>
    <form onSubmit={submit}>
      <label className="vault-label" htmlFor="vault-email">Email</label>
      <input className="vault-input" id="vault-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
      <label className="vault-label" htmlFor="vault-password">Password</label>
      <input className="vault-input" id="vault-password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} />
      {error && <p className="vault-error" role="alert">{error}</p>}
      <button className="vault-button vault-button-gold vault-full" style={{ marginTop: 24 }} disabled={busy}>{busy ? 'Signing in…' : 'Sign in →'}</button>
    </form>
    <p className="vault-subtle vault-small"><Link className="vault-link" href="/portal/forgot-password">Forgot password?</Link></p>
    <p className="vault-subtle vault-small">New to The Vault? <Link className="vault-link" href="/portal">Choose a membership</Link>.</p>
  </div></main>;
}
