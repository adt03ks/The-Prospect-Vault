import './styles.css';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Prospect Vault | Recruit • NIL • Brand • Elevate',
  description:
    'Build your athlete profile, showcase your talent and grow your brand.',
  icons: {
    icon: [
      { url: '/icons/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <Link href="/" className="brand" aria-label="The Prospect Vault home">
            <img
              src="/images/prospect-vault-logo.png"
              alt="The Prospect Vault"
            />
          </Link>

          <nav className="site-nav" aria-label="Primary">
            <Link href="/">Home</Link>
            <Link href="/athletes">Athlete Profiles</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/memberships">Memberships</Link>
            <Link href="/resources">Resources</Link>
          </nav>

          <div className="header-actions">
            <Link href="/login" className="outline-button">
              Log In
            </Link>
            <Link href="/signup" className="button">
              Get Started
            </Link>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          <div>
            <strong>The Prospect Vault</strong>
            <p className="muted">
              Recruiting and NIL tools for athletes across every sport.
            </p>
          </div>

          <div>
            <Link href="/recruiting">Recruiting</Link>
            <Link href="/nil">NIL</Link>
            <Link href="/memberships">Memberships</Link>
            <Link href="/resources">Resources</Link>
          </div>

          <p className="fineprint">
            © {new Date().getFullYear()} The Prospect Vault. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
