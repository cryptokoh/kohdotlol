import { useEffect, useState } from 'react'
import './Portfolio.css'

const focusAreas = [
  {
    title: 'Public surfaces',
    text: 'Landing pages, campaign sites, and clean presentation layers that feel specific instead of generic.'
  },
  {
    title: 'Operator tooling',
    text: 'Dashboards, intake flows, and small internal systems that keep the work moving without adding noise.'
  },
  {
    title: 'Experiments',
    text: 'Short runs, prototypes, and live builds that test a direction before it turns into a larger surface.'
  }
]

const currentNotes = [
  'Shipping lighter layouts with clearer hierarchy.',
  'Keeping the visual language warm, calm, and legible.',
  'Preserving the older builds as legacy routes instead of the homepage.'
]

export default function Portfolio() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  return (
    <div className={`koh-home ${ready ? 'is-ready' : ''}`}>
      <div className="koh-home__backdrop" aria-hidden="true" />
      <div className="koh-home__grid" aria-hidden="true" />

      <header className="koh-nav">
        <div className="koh-shell koh-nav__inner">
          <a className="koh-brand" href="/" aria-label="koh.lol home">
            <span className="koh-brand__mark" aria-hidden="true">koH</span>
            <span className="koh-brand__text">
              <span className="koh-brand__top">koh.lol</span>
              <span className="koh-brand__bottom">public builds and notes</span>
            </span>
          </a>

          <nav className="koh-nav__links" aria-label="Primary">
            <a href="#work">Work</a>
            <a href="#notes">Notes</a>
            <a href="#connect">Connect</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="koh-hero">
          <div className="koh-shell koh-hero__inner">
            <div className="koh-hero__copy">
              <p className="koh-eyebrow">koh.lol / 2026</p>
              <h1>Building clean web surfaces, tools, and experiments.</h1>
              <p className="koh-lede">
                The homepage is now tuned for clarity, not spectacle. It gives the work room to
                breathe, keeps the structure legible on mobile, and leaves the older dark build
                behind as a legacy route.
              </p>

              <div className="koh-actions">
                <a className="koh-button koh-button--primary" href="#work">
                  View work
                </a>
                <a className="koh-button koh-button--secondary" href="#notes">
                  Read notes
                </a>
              </div>
            </div>

            <aside className="koh-panel">
              <p className="koh-panel__label">Current focus</p>
              <dl className="koh-keylist">
                <div>
                  <dt>Surface</dt>
                  <dd>Public site, campaign pages, and microsites</dd>
                </div>
                <div>
                  <dt>Style</dt>
                  <dd>Warm editorial, amber accent, quiet contrast</dd>
                </div>
                <div>
                  <dt>Priority</dt>
                  <dd>Clear hierarchy, mobile fit, and low friction</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="koh-section" id="work">
          <div className="koh-shell">
            <div className="koh-section__heading">
              <p className="koh-eyebrow">What the site holds</p>
              <h2>Three lanes, one simpler presentation.</h2>
              <p>
                The current structure keeps the homepage focused on the work itself instead of
                layering on effects that compete with the content.
              </p>
            </div>

            <div className="koh-card-grid">
              {focusAreas.map((item) => (
                <article className="koh-card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="koh-section koh-section--split" id="notes">
          <div className="koh-shell koh-split">
            <div className="koh-section__heading koh-section__heading--compact">
              <p className="koh-eyebrow">Notes</p>
              <h2>What changed in the newer style.</h2>
              <p>
                The page now reads as a calm public surface, with a softer palette, clearer type
                scale, and less visual clutter.
              </p>
            </div>

            <div className="koh-notes">
              {currentNotes.map((note) => (
                <article className="koh-note" key={note}>
                  <p>{note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="koh-section" id="connect">
          <div className="koh-shell koh-cta">
            <div>
              <p className="koh-eyebrow">Connect</p>
              <h2>Reach out when the next surface is ready.</h2>
              <p>
                The page is set up for small, specific updates. Drop in the next link, project,
                or contact path when it is ready to ship.
              </p>
            </div>

            <div className="koh-cta__actions">
              <a className="koh-button koh-button--primary" href="mailto:hello@koh.lol">
                Email
              </a>
              <a className="koh-button koh-button--secondary" href="/legacy">
                Open legacy
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="koh-footer">
        <div className="koh-shell koh-footer__inner">
          <p>koh.lol, newer homepage style.</p>
          <p className="koh-footer__meta">Legacy routes stay available, but the homepage stays clean.</p>
        </div>
      </footer>
    </div>
  )
}
