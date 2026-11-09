'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/portal' || pathname.startsWith('/portal/')) return <>{children}</>;
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand" aria-label="The Prospect Vault homepage">
          <img src="/images/prospect-vault-official-logo.png" alt="The Prospect Vault" width="1774" height="887" />
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/athletes">Athlete Profiles</Link>
          <Link href="/how-it-works">How It Works</Link>
          <Link href="/memberships">Memberships</Link>
          <Link href="/resources">Resources</Link>
        </nav>
        <div className="header-actions">
          <Link className="outline-button" href="/portal/login">Log In</Link>
          <Link className="button" href="/portal/signup">Get Started</Link>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div>
          <strong>THE PROSPECT VAULT</strong>
          <p className="muted">RECRUIT | NIL | BRAND | ELEVATE</p>
        </div>
        <div className="footer-links">
          <Link href="/recruiting">Recruiting</Link>
          <Link href="/nil">NIL</Link>
          <Link href="/memberships">Memberships</Link>
          <Link href="/resources">Resources</Link>
        </div>
        <p className="fineprint">Athlete visibility does not guarantee scholarship offers or NIL opportunities. Minor athlete profiles require appropriate guardian authorization.</p>
      </footer>
    </>
  );
}
