import Link from 'next/link';

const sports = [
  'Football', 'Basketball', 'Baseball / Softball', 'Soccer',
  'Track & Field', 'Wrestling', 'Volleyball', 'Cross Country',
  'Golf', 'Bowling', 'Swimming / Diving', 'Tennis',
  'Lacrosse', 'Ice / Field Hockey',
];

const features = [
  {
    number: '01',
    title: 'BUILD YOUR PROFILE',
    body: 'Give coaches and brands a polished destination for your athletic story, achievements and goals.',
  },
  {
    number: '02',
    title: 'SHOW YOUR GAME',
    body: 'Organize highlights, images, academic milestones and verified performance information.',
  },
  {
    number: '03',
    title: 'OWN YOUR NEXT LEVEL',
    body: 'Build a recruiting presence now and develop a professional NIL brand as your journey evolves.',
  },
];

export default function Home() {
  return (
    <>
      <section className="hero-live" aria-labelledby="hero-heading">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-inner content-width">
          <div className="hero-copy">
            <p className="eyebrow hero-eyebrow">RECRUIT <span>|</span> NIL <span>|</span> BRAND <span>|</span> ELEVATE</p>
            <p className="hero-kicker">THE RECRUITING &amp; NIL PLATFORM FOR <strong>ALL ATHLETES</strong></p>
            <h1 id="hero-heading">MORE THAN A PROFILE.<br />A PLATFORM FOR <em>YOUR NEXT LEVEL.</em></h1>
            <p className="hero-description">
              Build your exposure, showcase your talent, connect with opportunities,
              and grow your athletic brand — all in one place.
            </p>
            <div className="hero-buttons">
              <Link href="/signup" className="button">Create Your Athlete Profile <span aria-hidden="true">→</span></Link>
              <Link href="/how-it-works" className="outline-button">See How It Works <span aria-hidden="true">→</span></Link>
            </div>
            <p className="hero-note">HIGH SCHOOL RECRUITING <span>•</span> COLLEGIATE NIL <span>•</span> EVERY SPORT</p>
            <div className="hero-proof" aria-label="Platform capabilities">
              <div><span className="hero-proof-index">01</span> GET RECRUITED</div>
              <div><span className="hero-proof-index">02</span> SHOWCASE TALENT</div>
              <div><span className="hero-proof-index">03</span> BUILD YOUR BRAND</div>
            </div>
          </div>

          <div className="hero-showcase">
            <figure className="hero-lineup">
              <img
                src="/images/prospect-vault-athlete-lineup.webp"
                alt="A diverse lineup of athletes from multiple sports standing under stadium lights"
                width="1055"
                height="320"
              />
              <figcaption>EVERY ATHLETE HAS A STORY WORTH SEEING.</figcaption>
            </figure>
            <div className="showcase-devices" aria-label="Illustrative athlete profile desktop and phone previews">
              <div className="preview-laptop">
                <div className="preview-toolbar" aria-hidden="true"><span /><span /><span /><small>THE PROSPECT VAULT / PROFILE PREVIEW</small></div>
                <div className="preview-laptop-screen">
                  <img src="/icons/prospect-vault-app-icon.png" alt="" width="132" height="132" className="preview-brand-icon" />
                  <div className="preview-athlete-details">
                    <span className="preview-label">SAMPLE ATHLETE PROFILE</span>
                    <strong>JADEN CARTER</strong>
                    <span>Quarterback · Class of 2027</span>
                    <div className="preview-divider" />
                    <div className="preview-checks"><span>✓ Film &amp; highlights</span><span>✓ Performance stats</span><span>✓ Academics</span><span>✓ Recruiting information</span></div>
                  </div>
                </div>
                <div className="laptop-stand" aria-hidden="true" />
              </div>
              <div className="preview-phone" aria-label="Mobile app icon preview">
                <div className="phone-notch" aria-hidden="true" />
                <img src="/icons/prospect-vault-app-icon.png" alt="The Prospect Vault app icon" width="110" height="110" />
                <span>YOUR VAULT.<br />ANYWHERE.</span>
                <div className="phone-home" aria-hidden="true" />
              </div>
            </div>
            <p className="showcase-caption">A professional profile on every screen.</p>
          </div>
        </div>
      </section>

      <section className="hero-action content-width" aria-labelledby="spotlight-heading">
        <div>
          <span className="eyebrow">YOUR TALENT. YOUR STORY. YOUR NEXT LEVEL.</span>
          <h2 id="spotlight-heading">Don’t just play the game. <em>Own your spotlight.</em></h2>
          <p>From high school recruiting to collegiate NIL, build a professional home for your athletic journey.</p>
        </div>
        <div className="action-buttons">
          <Link href="/recruiting" className="outline-button">Explore Recruiting →</Link>
          <Link href="/nil" className="outline-button">Explore NIL →</Link>
        </div>
      </section>

      <section className="section content-width" aria-labelledby="sports-heading">
        <div className="section-heading">
          <span className="eyebrow">BUILT FOR EVERY ATHLETE</span>
          <h2 id="sports-heading">One platform. Every sport. Every ambition.</h2>
          <p className="section-subtitle">From your first recruiting reel to your next brand partnership, your journey belongs here.</p>
        </div>
        {/* Single sport list: deliberately not repeated in the hero. */}
        <div className="sport-grid">
          {sports.map((sport) => <span className="sport-chip" key={sport}>{sport}</span>)}
        </div>
      </section>

      <section className="section section-dark" aria-labelledby="features-heading">
        <div className="content-width">
          <span className="eyebrow">THE PROSPECT VAULT ADVANTAGE</span>
          <h2 id="features-heading">Make every opportunity count.</h2>
          <div className="feature-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.number}>
                <span className="feature-number">{feature.number}</span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section content-width journey-grid" aria-label="Athlete pathways">
        <article className="journey-card">
          <span className="eyebrow">HIGH SCHOOL RECRUITING</span>
          <h2>Get ready to be seen.</h2>
          <p>Showcase your film, athletic performance, academics and recruiting information in one organized profile.</p>
          <Link className="text-link" href="/recruiting">Explore recruiting →</Link>
        </article>
        <article className="journey-card">
          <span className="eyebrow">COLLEGIATE NIL</span>
          <h2>Make your name your brand.</h2>
          <p>Present your story, audience and partnership interests through a professional athlete media kit.</p>
          <Link className="text-link" href="/nil">Explore NIL →</Link>
        </article>
      </section>

      <section className="final-cta">
        <div className="content-width">
          <span className="eyebrow">THE NEXT CHAPTER STARTS HERE</span>
          <h2>Put your potential on display.</h2>
          <p>Build your athlete profile and take control of how your story is presented.</p>
          <Link className="button" href="/signup">Get Started →</Link>
        </div>
      </section>
    </>
  );
}
