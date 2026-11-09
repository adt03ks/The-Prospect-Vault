import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import SiteChrome from '@/components/SiteChrome';
import './styles.css';

export const metadata: Metadata = {
  title: 'The Prospect Vault | Recruit • NIL • Brand • Elevate',
  description: 'Build your athlete profile, showcase your talent and grow your brand.',
  icons: {
    icon: [
      { url: '/icons/favicon.ico', sizes: 'any' },
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }]
  }
};

export default function RootLayout({children}:{children:ReactNode}) {
  return <html lang="en"><body><SiteChrome>{children}</SiteChrome></body></html>;
}
