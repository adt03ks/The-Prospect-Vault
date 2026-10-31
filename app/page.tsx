import Link from 'next/link';

const sports = [
  'Football', 'Basketball', 'Baseball / Softball', 'Soccer',
  'Track & Field', 'Wrestling', 'Volleyball', 'Cross Country',
  'Golf', 'Bowling', 'Swimming / Diving', 'Tennis',
  'Lacrosse', 'Ice / Field Hockey',
];

const highlights = [
  { title: 'GET RECRUITED', icon: 'person' },
  { title: 'SHOWCASE YOUR TALENT', icon: 'chart' },
  { title: 'BUILD YOUR BRAND', icon: 'cap' },
  { title: 'UNLOCK NIL OPPORTUNITIES', icon: 'coins' },
] as const;

const features = [
  { number: '01', title: 'BUILD YOUR PROFILE', body: 'Give coaches and brands a polished destination for your story, athletic achievements and goals.' },
  { number: '02', title: 'SHOW YOUR GAME', body: 'Organize your best highlights, images, academics and verified performance information.' },
  { number: '03', title: 'OWN YOUR NEXT LEVEL', body: 'Develop a recruiting presence today and a professional NIL brand tomorrow.' },
];

type HighlightIcon = (typeof highlights)[number]['icon'];

function HighlightSymbol({ icon }: { icon: HighlightIcon }) {
  return (
    <svg viewBox="0 0 42 42" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icon === 'person' && <><circle cx="21" cy="13" r="7" /><path d="M8 37v-5c0-8 6-12 13-12s13 4 13 12v5H8Z" /><path d="M30 8l2-2m-2 9h4" /></>}
      {icon === 'chart' && <><path d="M6 35V25h7v10M17 35V19h7v16M28 35V11h7v24" /><path d="M7 17l10-7 8 2 10-8M29 4h6v6" /></>}
      {icon === 'cap' && <><path d="m3 16 18-9 18 9-18 9-18-9Z" /><path d="M10 21v9c5 5 17 5 22 0v-9M39 16v14" /></>}
      {icon === 'coins' && <><ellipse cx="21" cy="12" rx="13" ry="5" /><path d="M8 12v8c0 3 6 5 13 5s13-2 13-5v-8M8 20v8c0 3 6 5 13 5s13-2 13-5v-8M8 28v5c0 3 6 5 13 5s13-2 13-5v-5" /></>}
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <section className="vault-hero" aria-labelledby="vault-hero-title">
        {/* The artwork is a crop of the approved design: NO baked navigation or CTA text. */}
        <div className="vault-hero__content content-width">
          <div className="vault-hero__copy">
            <p className="vault-hero__eyebrow">RECRUIT <span>|</span> NIL <span>|</span> BRAND <span>|</span> ELEVATE</p>
            <p className="vault-hero__kicker">THE RECRUITING &amp; NIL PLATFORM FOR <strong>ALL ATHLETES</strong></p>
            <h1 id="vault-hero-title">
              MORE THAN A<br />
              PROFILE.<br />
              A PLATFORM FOR<br />
              <em>YOUR NEXT LEVEL.</em>
            </h1>
            <p className="vault-hero__description">
              Build your exposure, showcase your talent, connect with recruiters,
              and unlock NIL opportunities — all in one powerful platform.
            </p>
            <div className="vault-hero__buttons">
              <Link href="/signup" className="vault-hero__primary">Create Your Athlete Profile <span aria-hidden="true">→</span></Link>
              <Link href="/how-it-works" className="vault-hero__secondary"><span className="vault-hero__play" aria-hidden="true">▶</span> Watch How It Works</Link>
            </div>
            <div className="vault-hero__highlights" aria-label="Platform capabilities">
              {highlights.map((item) => (
                <div className="vault-hero__highlight" key={item.title}>
                  <HighlightSymbol icon={item.icon} />
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <img
          className="vault-hero__art"
          src="/images/hero-athletes-devices.webp"
          width={1056}
          height={625}
          alt="Multicultural athletes representing baseball, basketball, football, soccer and track, alongside The Prospect Vault desktop and phone previews with the official logo"
        />
        <div className="vault-hero__light" aria-hidden="true" />
      </section>

      {/* The full sports strip from the approved concept is a separate image, never duplicated in the hero. */}
      <section className="vault-sports" aria-label="Sports supported by The Prospect Vault">
        <img className="vault-sports__poster" src="/images/sports-showcase.webp" alt="Built for athletes across every sport: football, basketball, baseball, soccer, track and field, wrestling, volleyball, cross country, golf, bowling, swimming and diving, tennis, lacrosse, ice hockey and field hockey" width={1671} height={204} />
        <div className="vault-sports__mobile content-width">
          <h2>BUILT FOR ATHLETES ACROSS <em>EVERY SPORT</em></h2>
          <div className="vault-sports__mobile-grid">
            {sports.map((sport) => <span key={sport}>{sport}</span>)}
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

      <section className="section section-dark" aria-labelledby="advantage-heading">
        <div className="content-width">
          <span className="eyebrow">THE PROSPECT VAULT ADVANTAGE</span>
          <h2 id="advantage-heading">Make every opportunity count.</h2>
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

      <section className="section content-width journey-grid" aria-label="Athlete journeys">
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
