'use client';
import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { vaultClient } from '@/lib/vault/browser';
export default function ResetPassword() {
  const [password, setPassword] = useState(''); const [status, setStatus] = useState(''); const [done, setDone] = useState(false);
  async function update(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { error } = await vaultClient().auth.updateUser({ password });
    if (error) setStatus(error.message); else { setDone(true); setStatus('Your password was updated.'); }
  }
  return <main className="vault-main"><section className="vault-form-card vault-card"><h1>Choose a new password</h1>
    <form onSubmit={update}><label className="vault-label" htmlFor="new-password">New password</label><input className="vault-input" id="new-password" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit" className="vault-button vault-button-gold vault-full" style={{ marginTop: 20 }}>Save new password</button></form>
    {status && <p className={done ? 'vault-success' : 'vault-error'} role="status">{status}</p>}
    {done && <Link className="vault-link" href="/portal/dashboard">Go to dashboard</Link>}
  </section></main>;
}
