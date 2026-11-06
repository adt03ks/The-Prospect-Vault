'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { vaultClient } from '@/lib/vault/browser';
export default function ForgotPassword() {
  const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  async function send(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true);
    const { error } = await vaultClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/portal/auth/callback?next=/portal/reset-password`
    });
    setBusy(false); setMessage(error?.message ?? 'If the email belongs to an account, a reset link has been sent.');
  }
  return <main className="vault-main"><section className="vault-form-card vault-card"><h1>Reset your password</h1>
    <p className="vault-subtle">Enter the email address connected to your account.</p>
    <form onSubmit={send}><label className="vault-label" htmlFor="reset-email">Email</label><input id="reset-email" className="vault-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
      <button type="submit" className="vault-button vault-button-gold vault-full" style={{ marginTop: 20 }} disabled={busy}>Email reset link</button></form>
    {message && <p role="status" className="vault-note">{message}</p>}
    <p><Link className="vault-link" href="/portal/login">Back to sign in</Link></p>
  </section></main>;
}
