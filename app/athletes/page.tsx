import Link from 'next/link';

export const metadata = {
  title: 'Athlete Profiles | The Prospect Vault',
  description: 'Athlete recruiting and NIL profiles on The Prospect Vault'
};
export default function AthletesIndex() {
  return (
    <section className="section content-width">
      <span className="eyebrow">ATHLETE PROFILES</span>
      <h1>Every athlete has a story.</h1>
      <p>Showcase your accomplishments, game film, academics, and athletic goals with The Prospect Vault.</p>
      <p>A public searchable directory will be introduced after athlete and guardian publishing permissions are complete.</p>
      <div className="action-buttons">
        <Link className="button" href="/portal/signup">Create Your Athlete Profile →</Link>
        <Link className="outline-button" href="/recruiting">Explore Recruiting →</Link>
      </div>
    </section>
  );
}
