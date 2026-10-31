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
  [
    '01',
    'BUILD YOUR PROFILE',
    'Give coaches and brands a polished destination for your story, athletic achievements and goals.'
  ],
  [
    '02',
    'SHOW YOUR GAME',
    'Organize your best highlights, images and verified performance information.'
  ],
  [
    '03',
    'OWN YOUR NEXT LEVEL',
    'Develop a recruiting presence today and a professional NIL brand tomorrow.'
  ]
];

const heroBenefits = [
  ['GET RECRUITED', '🏅'],
  ['SHOWCASE YOUR TALENT', '📈'],
  ['BUILD YOUR BRAND', '🎓'],
  ['UNLOCK NIL OPPORTUNITIES', '💰']
];

export default function Home() {
  return (
    <>
      <section className="hero-live">
        <div className="hero-athletes" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />

        <div className="hero-inner content-width">
          <div className="hero-copy">
            <span className="eyebrow">
              RECRUIT &nbsp; | &nbsp; NIL &nbsp; | &nbsp; BRAND &nbsp; | &nbsp; ELEVATE
            </span>

            <p className="hero-kicker">
              THE RECRUITING & NIL PLATFORM FOR ALL ATHLETES
            </p>

            <h1>
              MORE THAN A PROFILE.
              <br />
              A PLATFORM FOR <em>YOUR NEXT LEVEL.</em>
            </h1>

            <p className="hero-description">
              Build your exposure, showcase your talent, connect with opportunities
              and grow your athletic brand — all in one place.
            </p>

            <div className="hero-buttons">
              <Link href="/signup" className="button">
                Create Your Athlete Profile →
              </Link>
              <Link href="/how-it-works" className="outline-button">
                Watch How It Works →
              </Link>
            </div>

            <p className="hero-note">
              High school recruiting • Collegiate NIL • Every sport
            </p>

            <div className="hero-benefits">
              {heroBenefits.map(([title, icon]) => (
                <div className="hero-benefit" key={title}>
                  <span className="hero-benefit-icon" aria-hidden="true">
                    {icon}
                  </span>
                  <span>{title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="laptop-mockup">
              <div className="device-screen laptop-screen">
                <div className="screen-top">
                  <img
                    src="/icons/prospect-vault-app-icon.png"
                    alt=""
                    className="screen-logo"
                  />
                  <div className="screen-mini-profile">
                    <strong>Jaden Carter</strong>
                    <span>QB | Class of 2027</span>
                    <span>Profile • Stats • Highlights • NIL Media Kit</span>
                  </div>
                </div>

                <div className="screen-bottom">
                  <div className="video-thumb">▶</div>
                  <ul className="screen-checklist">
                    <li>Profile</li>
                    <li>Stats</li>
                    <li>Highlights</li>
                    <li>Academics</li>
                    <li>NIL Media Kit</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="phone-mockup">
              <div className="device-screen phone-screen">
                <img
                  src="/icons/prospect-vault-app-icon.png"
                  alt=""
                  className="screen-logo phone-logo"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="hero-sport-band content-width">
          <div className="hero-sport-band-title">
            BUILT FOR ATHLETES ACROSS EVERY SPORT
          </div>

          <div className="hero-sport-band-grid">
            {sports.map((sport) => (
              <span className="hero-sport-tile" key={sport}>
                {sport}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="hero-action content-width">
        <div>
          <span className="eyebrow">YOUR TALENT. YOUR STORY. YOUR NEXT LEVEL.</span>
          <h2>
            Don’t just play the game. <em>Own your spotlight.</em>
          </h2>
          <p>
            From high school recruiting to collegiate NIL, build a professional home
            for your athletic journey.
          </p>
        </div>

        <div className="action-buttons">
          <Link href="/recruiting" className="outline-button">
            Explore Recruiting →
          </Link>
          <Link href="/nil" className="outline-button">
            Explore NIL →
          </Link>
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

      <section className="section section-dark">
        <div className="content-width">
          <span className="eyebrow">THE PROSPECT VAULT ADVANTAGE</span>
          <h2>Make every opportunity count.</h2>

          <div className="feature-grid">
            {features.map(([n, title, body]) => (
              <article className="feature-card" key={n}>
                <span className="feature-number">{n}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section content-width journey-grid">
        <article className="journey-card">
          <span className="eyebrow">HIGH SCHOOL RECRUITING</span>
          <h2>Get ready to be seen.</h2>
          <p>
            Showcase your film, athletic performance, academics and recruiting
            information in one organized profile.
          </p>
          <Link className="text-link" href="/recruiting">
            Explore recruiting →
          </Link>
        </article>

        <article className="journey-card">
          <span className="eyebrow">COLLEGIATE NIL</span>
          <h2>Make your name your brand.</h2>
          <p>
            Present your story, audience and partnership interests through a
            professional athlete media kit.
          </p>
          <Link className="text-link" href="/nil">
            Explore NIL →
          </Link>
        </article>
      </section>

      <section className="final-cta">
        <div className="content-width">
          <span className="eyebrow">THE NEXT CHAPTER STARTS HERE</span>
          <h2>Put your potential on display.</h2>
          <p>
            Build your athlete profile and take control of how your story is presented.
          </p>
          <Link className="button" href="/signup">
            Get Started →
          </Link>
        </div>
      </section>
    </>
  );
}
