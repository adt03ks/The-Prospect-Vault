import type { ReactNode } from 'react';
import './styles.css';
export const metadata = { title: 'The Prospect Vault', description: 'Athlete recruiting and NIL profiles' };
export default function Layout({children}:{children:ReactNode}) { return <html lang="en"><body><header><a href="/">THE PROSPECT VAULT</a><nav><a href="/signup">Get Started</a> · <a href="/login">Sign In</a> · <a href="/dashboard">Dashboard</a></nav></header><main>{children}</main><footer>Recruit • NIL • Brand • Elevate</footer></body></html> }
