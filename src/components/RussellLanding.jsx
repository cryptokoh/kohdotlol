const linkedinUrl = 'https://www.linkedin.com/in/russell-herod-841372192/'

const experience = [
  {
    dates: '2024 to Present',
    title: 'Independent founder-builder / koH',
    body:
      'Building practical web platforms for community coordination, commerce, sales enablement, and public-good infrastructure.',
  },
  {
    dates: '2019 to 2024',
    title: 'KohX LLC',
    body:
      'Founded Kindness of Humanity Exchange and helped make blockchain concepts approachable for charities, impact groups, and new users.',
  },
  {
    dates: '2009 to 2018',
    title: 'RA Resources',
    body:
      'Ran device repair and electronics support work, with a steady focus on troubleshooting, customer service, and clear communication.',
  },
  {
    dates: '2002 to 2009',
    title: 'Operations, sales, and technical support',
    body:
      'Managed refurbished equipment sales, inventory, warehouse flow, file work, customer service, and hands-on technical support.',
  },
]

export default function RussellLanding() {
  return (
    <main className="russell-page">
      <section className="russell-hero" aria-labelledby="russell-title">
        <header className="russell-nav">
          <a className="russell-mark" href="/" aria-label="koH home">
            koH
          </a>
          <nav className="russell-links" aria-label="Primary">
            <a href="#profile">Profile</a>
            <a href="/russell-herod-resume.md">Resume</a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </nav>
        </header>

        <div className="russell-hero__inner">
          <div className="russell-intro">
            <p className="eyebrow">koH <span aria-hidden="true">·</span> Love of Life</p>
            <h1 id="russell-title">Russell Herod</h1>
            <p className="lede">
              Founder, technical operator, and builder of useful systems for people and communities.
            </p>
            <div className="russell-actions" aria-label="Contact and resume links">
              <a className="button button--primary" href={linkedinUrl} target="_blank" rel="noreferrer">
                Connect on LinkedIn
              </a>
              <a className="button" href="/russell-herod-resume.md">
                View resume
              </a>
            </div>
          </div>

          <aside className="russell-note" aria-label="Profile summary">
            <p>
              Russell works across the practical middle ground where people, tools, and operations meet. His work
              spans hardware support, e-commerce, product planning, community platforms, and nonprofit infrastructure.
            </p>
            <dl>
              <div>
                <dt>Focus</dt>
                <dd>Clear systems for real-world use</dd>
              </div>
              <div>
                <dt>Background</dt>
                <dd>Support, repair, sales, web platforms</dd>
              </div>
              <div>
                <dt>Current practice</dt>
                <dd>koH, HAND Protocol, Harmonik</dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      <section className="russell-section russell-section--intro" id="profile">
        <p className="section-kicker">Profile</p>
        <div className="russell-prose russell-prose--large">
          <p>
            koH is the ongoing practice of Russell Herod: helping people understand tools, solve practical problems, and
            move meaningful work forward. It began with hands-on technical support and grew into platforms for
            coordination, commerce, and public benefit.
          </p>
        </div>
      </section>

      <section className="russell-section">
        <div className="russell-section__header">
          <p className="section-kicker">Experience</p>
          <h2>Built from hands-on work</h2>
        </div>
        <div className="russell-experience">
          {experience.map((item) => (
            <article key={item.title}>
              <span>{item.dates}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="russell-section russell-section--split">
        <div>
          <p className="section-kicker">Foundation</p>
          <h2>Comfortable with both people and systems</h2>
        </div>
        <div className="russell-prose">
          <p>
            Russell founded a web-hosting company as a teenager, worked with support tools and hardware, and stayed
            comfortable moving between business operations, communication, and technical problem-solving.
          </p>
          <p>
            His work keeps returning to the same practical question: how can a tool make people feel more capable,
            more connected, and less blocked by the systems around them?
          </p>
        </div>
      </section>
    </main>
  )
}
