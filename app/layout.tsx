import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'The Prospect Vault | Athlete Memberships',
  description: 'Build your recruiting profile, add highlights, and own your next level.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body style={{ margin: 0, background: '#080a0f' }}>{children}</body></html>;
}
