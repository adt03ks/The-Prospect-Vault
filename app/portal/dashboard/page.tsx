'use client';
import Link from 'next/link';
import { PLANS, includedPlannedFeatures } from '@/lib/vault/catalog';
import { getProgress } from '@/lib/vault/progress';
import { useVaultData } from '@/lib/vault/useVaultData';

export default function Dashboard() {
  const { loading, error, account, profile, media, stats, contacts } = useVaultData();
  if (loading) return <main className="vault-main"><p>Loading your member dashboard…</p></main>;
  if (error) return <main className="vault-main"><p className="vault-error">{error}</p></main>;
  if (!account) return null;
  const tier = PLANS[account.plan];
  const roadmapItems = includedPlannedFeatures(account.plan);
  const steps = getProgress(profile, media, stats, contacts);
  const ready = steps.filter(step => step.ready).length;
  const percent = Math.round(ready / steps.length * 100);
  const photos = media.filter(item => item.kind === 'photo').length;
  const videos = media.filter(item => item.kind === 'video').length;
  return <main className="vault-main">
    <section className="vault-dashboard-header">
      <div>
        <div className="vault-eyebrow">YOUR ATHLETE WORKSPACE</div>
        <h1>{profile?.athlete_name ? `Let's build, ${profile.athlete_name.split(' ')[0]}.` : 'Welcome to The Vault.'}</h1>
        <p className="vault-subtle">Build your profile. Show your game. Own your next level.</p>
      </div>
      <div className="vault-card" style={{ padding: 18, minWidth: 215 }}>
        <div className="vault-pill">{tier.title} membership</div>
        <p className="vault-subtle vault-small">${tier.monthlyPrice}/month • Selected package</p>
        <p className="vault-pending">{account.subscription_status === 'active' ? 'Active subscription' : 'Billing not activated'}</p>
      </div>
    </section>

    <section className="vault-card" style={{ marginBottom: 20 }} aria-label="Profile completion">
      <div className="vault-inline" style={{ justifyContent: 'space-between' }}><h2 style={{ margin: 0 }}>Profile completion</h2><strong style={{ color: '#f6c665', fontSize: 23 }}>{percent}%</strong></div>
      <div className="vault-statbar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Setup completed"><div className="vault-statbar-fill" style={{ width: `${percent}%` }} /></div>
      <p className="vault-subtle vault-small">{ready} of {steps.length} setup essentials completed. Your workspace saves each step, even if you come back later.</p>
      <Link href="/portal/onboarding" className="vault-button vault-button-gold">{ready === 5 ? 'Review your profile' : 'Continue setup'} →</Link>
    </section>
    <section className="vault-dashboard-grid" aria-label="Membership features">
      {steps.map((step, i) => <article key={step.title} className="vault-feature-card">
        <div className="vault-feature-number">{i + 1}</div><div className="vault-feature-copy">
          <h3>{step.title}</h3><p>{step.description}{i === 1 ? ` • ${photos}/${tier.photoLimit} photos` : i === 2 ? ` • ${videos}/${tier.videoLimit} videos` : ''}</p>
          <div className={step.ready ? 'vault-done' : 'vault-pending'}>{step.ready ? '✓ Complete' : '○ Needs attention'}</div>
        </div><Link className="vault-link vault-small" href={`/portal/onboarding?step=${i + 1}`}>Manage</Link>
      </article>)}
    </section>

    <section className="vault-card" style={{ marginTop: 20 }}>
      <div className="vault-eyebrow">ROADMAP</div><h2>Package extras</h2>
      {roadmapItems.length ? <div className="vault-dashboard-grid">
        {roadmapItems.map(feature => <div className="vault-feature-card vault-locked" key={feature}><div className="vault-feature-copy"><h3>{feature}</h3><p>Included in your selected plan when this feature launches.</p><span className="vault-pill">Planned • not available yet</span></div></div>)}
      </div> : <p className="vault-subtle">Upgrade options will appear here when billing is connected.</p>}
    </section>
    <p className="vault-footnote">All data is private to the signed-in account in this starter portal. Public athlete pages, search, verified subscriptions, and recruiter access are not yet enabled.</p>
  </main>;
}
