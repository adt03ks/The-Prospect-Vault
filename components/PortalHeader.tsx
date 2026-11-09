'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { vaultClient } from '@/lib/vault/browser';

export default function PortalHeader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    try {
      await vaultClient().auth.signOut();
      router.replace('/portal/login');
      router.refresh();
    } catch {
      setBusy(false);
    }
  }
  return (
    <header className="vault-header">
      <Link href="/portal" className="vault-brand">
        <span className="vault-brand-mark">V</span>
        <span>THE PROSPECT <em>VAULT</em></span>
      </Link>
      <nav className="vault-nav" aria-label="Member navigation">
        <Link href="/">Main website</Link>
        <Link href="/portal">Memberships</Link>
        <Link href="/portal/dashboard">Dashboard</Link>
        <Link href="/portal/onboarding">My profile</Link>
        <Link href="/portal/login">Log in</Link>
        <button className="vault-nav-button" type="button" onClick={signOut} disabled={busy}>
          {busy ? 'Signing out…' : 'Sign out'}
        </button>
      </nav>
    </header>
  );
}
