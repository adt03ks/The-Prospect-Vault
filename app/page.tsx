import Link from 'next/link';
import { PLANS, type Plan } from '@/lib/vault/catalog';

export default function MembershipsPage() {
  const plans: Plan[] = ['starter', 'pro', 'elite'];
  return (
    <main className="vault-main">
      <section className="vault-hero">
        <div className="vault-eyebrow">ATHLETE MEMBERSHIPS</div>
        <h1>Your game. <span>Your platform.</span></h1>
        <p>Choose your package, create an account, and follow a personalized setup experience to build your recruiting presence.</p>
      </section>
      <div className="vault-plan-grid">
        {plans.map(plan => {
          const tier = PLANS[plan];
          return <article className={'vault-plan vault-plan-' + plan} key={plan}>
            {plan === 'pro' && <div className="vault-plan-ribbon">MOST POPULAR</div>}
            <h2>{tier.title}</h2>
            <div className="vault-price"><strong>${tier.monthlyPrice}</strong><span>/ month</span></div>
            <ul>
              {tier.features.map(feature => <li key={feature}>{feature}</li>)}
              {tier.planned.map(feature => <li key={feature}>{feature} <span className="vault-planned">PLANNED</span></li>)}
            </ul>
            <Link className="vault-button vault-button-gold" href={'/portal/signup?plan=' + plan}>Start Your Profile <span aria-hidden="true">→</span></Link>
          </article>;
        })}
      </div>
      <p className="vault-footnote">This starter portal shows the published package structure. Billing is not connected yet; selecting a plan does not charge a card or activate a paid subscription.</p>
    </main>
  );
}
