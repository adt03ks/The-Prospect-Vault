import type { ReactNode } from 'react';
import PortalHeader from '@/components/PortalHeader';
import './portal.css';

export default function PortalLayout({ children }: { children: ReactNode }) {
  return <div className="vault-app"><PortalHeader />{children}<footer className="vault-footer">THE PROSPECT VAULT <span>•</span> BUILD YOUR PROFILE. SHOW YOUR GAME. OWN YOUR NEXT LEVEL.</footer></div>;
}
