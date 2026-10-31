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
  'Ice / Field Hockey'
];

const features = [
  ['01', 'GET RECRUITED'],
  ['02', 'SHOWCASE TALENT'],
  ['03', 'BUILD YOUR BRAND']
];

export default function Home() {
  return (
    <>
      <section className="hero-premium">
        <div className="hero-premium-bg" aria-hidden="true" />
        <div className="hero-premium-lines" aria-hidden="true" />

        <div className="content-width hero-premium-grid">
          <div className="hero-premium-copy">
            <span className="eyebrow">
              RECRUIT &nbsp; | &nbsp; NIL &nbsp; | &nbsp; BRAND &nbsp; | &nbsp; ELEVATE
            </span>

            <p className="hero-kicker">
              THE RECRUITING & NIL PLATFORM FOR <span>ALL ATHLETES</span>
            </p>

            <h1>
              MORE THAN
              <br />
              A PROFILE.
              <br />
              A PLATFORM FOR
              <br />
              <em>YOUR NEXT LEVEL.</em>
            </h1>

            <p className="hero-description">
              Build your exposure, showcase your talent, connect with
              opportunities, and grow your athletic brand — all in one place.
            </p>

            <div className="hero-buttons">
              <Link href="/signup" className="button">
                Create Your Athlete Profile →
              </Link>
              <Link href="/how-it-works" className="outline-button">
                See How It Works →
              </Link>
            </div>

            <p className="hero-note">
              HIGH SCHOOL RECRUITING &nbsp; • &nbsp; COLLEGIATE NIL &nbsp; • &nbsp; EVERY SPORT
            </p>

            <div className="hero-feature-mini">
              {features.map(([n, label]) => (
                <div className="hero-feature-mini-card" key={n}>
                  <strong>{n}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-premium-visual">
            <div className="athlete-banner-card">
              <img
                src="/images/prospect-vault-athletes.jpg"
                alt="Diverse athletes representing multiple sports"
              />
              <div className="athlete-banner-caption">
                EVERY ATHLETE HAS A STORY WORTH SEEING.
              </div>
            </div>

            <div className="device-showcase">
              <div className="laptop-shell">
                <div className="laptop-topbar">
                  <span />
                  <span />
                  <span />
                  <p>THE PROSPECT VAULT / PROFILE PREVIEW</p>
                </div>

                <div className="laptop-screen">
                  <div className="laptop-screen-left">
                    <img
                      src="/icons/prospect-vault-app-icon.png"
                      alt="The Prospect Vault app icon"
                      className="device-icon"
                    />
                  </div>

                  <div className="laptop-screen-right">
                    <p className="screen-label">SAMPLE ATHLETE PROFILE</p>
                    <h3>JADEN CARTER</h3>
                    <p className="screen-sub">
                      Quarterback · Class of 2027
                    </p>

                    <div className="screen-checks">
                      <span>✓ Film & highlights</span>
                      <span>✓ Performance stats</span>
                      <span>✓ Academics</span>
                      <span>✓ Recruiting information</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="phone-shell">
                <div className="phone-notch" />
                <div className="phone-screen">
                  <img
                    src="/icons/prospect-vault-app-icon.png"
                    alt="The Prospect Vault mobile icon"
                    className="phone-icon"
                  />
                  <p>YOUR VAULT.<br />ANYWHERE.</p>
                </div>
              </div>
            </div>

            <p className="screen-footnote">
              A professional profile on every screen.
            </p>
          </div>
        </div>
      </section>

      <section className="section content-width">
        <div className="section-heading">
          <span className="eyebrow">BUILT FOR EVERY ATHLETE</span>
          <h2>One platform. Every sport. Every ambition.</h2>
        </div>

        <div className="sport-grid">
          {sports.map((s) => (
            <span className="sport-chip" key={s}>
              {s}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}

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
