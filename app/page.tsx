import Link from 'next/link';

const sports = [
  'Football',
  'Basketball',
  'Baseball / Softball',
  'Soccer',
  'Track & Field',
  'Wrestling',
  'Volleyball',
  'Cross Country',
  'Golf',
  'Bowling',
  'Swimming / Diving',
  'Tennis',
  'Lacrosse',
  'Ice / Field Hockey',
];

const heroFeatures = [
  ['01', 'GET RECRUITED'],
  ['02', 'SHOWCASE TALENT'],
  ['03', 'BUILD YOUR BRAND'],
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
      {/* Premium hero: all links and text are real, interactive page elements. */}
      <section className="hero-premium" aria-labelledby="hero-heading">
        <div className="hero-premium-bg" aria-hidden="true" />
        <div className="hero-premium-lines" aria-hidden="true" />

        <div className="content-width hero-premium-grid">
          <div className="hero-premium-copy">
            <p className="eyebrow">
              RECRUIT &nbsp; | &nbsp; NIL &nbsp; | &nbsp; BRAND &nbsp; | &nbsp; ELEVATE
            </p>
            <p className="hero-kicker">
              THE RECRUITING &amp; NIL PLATFORM FOR <span>ALL ATHLETES</span>
            </p>
            <h1 id="hero-heading">
              MORE THAN<br />
              A PROFILE.<br />
              A PLATFORM FOR<br />
              <em>YOUR NEXT LEVEL.</em>
            </h1>
            <p className="hero-description">
              Build your exposure, showcase your talent, connect with opportunities,
              and grow your athletic brand — all in one place.
            </p>
            <div className="hero-buttons">
              <Link href="/signup" className="button">
                Create Your Athlete Profile <span aria-hidden="true">→</span>
              </Link>
              <Link href="/how-it-works" className="outline-button">
                See How It Works <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className="hero-note">
              HIGH SCHOOL RECRUITING &nbsp; • &nbsp; COLLEGIATE NIL &nbsp; • &nbsp; EVERY SPORT
            </p>
            <div className="hero-feature-mini" aria-label="Platform highlights">
              {heroFeatures.map(([number, label]) => (
                <div className="hero-feature-mini-card" key={number}>
                  <strong>{number}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-premium-visual">
            <figure className="athlete-banner-card">
              <img
                src="/images/prospect-vault-athlete-lineup.webp"
                alt="Athletes from a variety of sports pictured under stadium lights"
                width={1055}
                height={320}
              />
              <figcaption className="athlete-banner-caption">
                EVERY ATHLETE HAS A STORY WORTH SEEING.
              </figcaption>
            </figure>

            <div className="device-showcase" aria-label="Illustrative athlete profile on desktop and phone">
              <div className="laptop-shell">
                <div className="laptop-topbar" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                  <p>THE PROSPECT VAULT / PROFILE PREVIEW</p>
                </div>
                <div className="laptop-screen">
                  <div className="laptop-screen-left">
                    <img
                      src="/icons/prospect-vault-app-icon.png"
                      alt="The Prospect Vault app logo"
                      width={170}
                      height={170}
                      className="device-icon"
                    />
                  </div>
                  <div className="laptop-screen-right">
                    <p className="screen-label">SAMPLE ATHLETE PROFILE</p>
                    <h3>JADEN CARTER</h3>
                    <p className="screen-sub">Quarterback · Class of 2027</p>
                    <div className="screen-checks">
                      <span>✓ Film &amp; highlights</span>
                      <span>✓ Performance stats</span>
                      <span>✓ Academics</span>
                      <span>✓ Recruiting information</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="phone-shell">
                <div className="phone-notch" aria-hidden="true" />
                <div className="phone-screen">
                  <img
                    src="/icons/prospect-vault-app-icon.png"
                    alt="The Prospect Vault mobile app icon"
                    width={110}
                    height={110}
                    className="phone-icon"
                  />
                  <p>YOUR VAULT.<br />ANYWHERE.</p>
                </div>
              </div>
            </div>
            <p className="screen-footnote">A professional profile on every screen.</p>
          </div>
        </div>
      </section>

      {/* Preserve all of the original below-the-fold homepage sections. */}
      <section className="hero-action content-width" aria-labelledby="spotlight-heading">
        <div>
          <span className="eyebrow">YOUR TALENT. YOUR STORY. YOUR NEXT LEVEL.</span>
          <h2 id="spotlight-heading">
            Don’t just play the game. <em>Own your spotlight.</em>
          </h2>
          <p>
            From high school recruiting to collegiate NIL, build a professional
            home for your athletic journey.
          </p>
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
          <p className="section-subtitle">
            From your first recruiting reel to your next brand partnership,
            your journey belongs here.
          </p>
        </div>
        <div className="sport-grid">
          {sports.map((sport) => (
            <span className="sport-chip" key={sport}>{sport}</span>
          ))}
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
          <p>
            Showcase your film, athletic performance, academics and recruiting
            information in one organized profile.
          </p>
          <Link className="text-link" href="/recruiting">Explore recruiting →</Link>
        </article>
        <article className="journey-card">
          <span className="eyebrow">COLLEGIATE NIL</span>
          <h2>Make your name your brand.</h2>
          <p>
            Present your story, audience and partnership interests through
            a professional athlete media kit.
          </p>
          <Link className="text-link" href="/nil">Explore NIL →</Link>
        </article>
      </section>

      <section className="final-cta">
        <div className="content-width">
          <span className="eyebrow">THE NEXT CHAPTER STARTS HERE</span>
          <h2>Put your potential on display.</h2>
          <p>
            Build your athlete profile and take control of how your story is presented.
          </p>
          <Link className="button" href="/signup">Get Started →</Link>
        </div>
      </section>
    </>
  );
}
