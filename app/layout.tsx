import type { ReactNode } from 'react';
import Link from 'next/link';
import './styles.css';
export const metadata = { title: 'The Prospect Vault | Recruit • NIL • Brand • Elevate', description: 'Build your athlete profile, showcase your talent and grow your brand.' };

icons: {
  icon: [
    {
      url: "/icons/favicon.ico",
      sizes: "any"
    },
    {
      url: "/icons/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png"
    },
    {
      url: "/icons/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png"
    }
  ],
  apple: [
    {
      url: "/icons/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png"
    }
  ]
},

export default function Layout({children}:{children:ReactNode}) { return <html lang="en"><body><header className="site-header"><Link href="/" className="brand" aria-label="The Prospect Vault home"><img src="/images/prospect-vault-official-logo.png" alt="The Prospect Vault" /></Link><nav className="site-nav" aria-label="Main navigation"><Link href="/">Home</Link><Link href="/athletes">Athlete Profiles</Link><Link href="/how-it-works">How It Works</Link><Link href="/memberships">Memberships</Link><Link href="/resources">Resources</Link></nav><div className="header-actions"><Link className="outline-button" href="/login">Log In</Link><Link className="button" href="/signup">Get Started</Link></div></header><main>{children}</main><footer className="site-footer"><div><strong>THE PROSPECT VAULT</strong><p>RECRUIT | NIL | BRAND | ELEVATE</p></div><div><Link href="/recruiting">Recruiting</Link><Link href="/nil">NIL</Link><Link href="/memberships">Memberships</Link><Link href="/resources">Resources</Link></div><p className="fineprint">Athlete visibility is not a guarantee of scholarship offers or NIL opportunities. Minor athlete profiles require appropriate guardian authorization.</p></footer></body></html> }
