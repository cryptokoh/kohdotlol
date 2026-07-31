import { useEffect, useState } from 'react'
import './Portfolio.css'
import CareerGraph from './components/CareerGraph'

const projectGroups = [
  {
    label: 'Public work',
    color: 'blue',
    tabs: [
      { name: 'HAND Protocol', meta: 'Foundation campaign', color: 'blue', text: 'A public-facing system for a regenerative infrastructure nonprofit, built to make the next action obvious.', href: 'https://handprotocol.netlify.app/' },
      { name: 'Public surfaces', meta: 'Independent builds', color: 'red', text: 'Landing pages, campaign sites, and small web moments with enough character to be remembered.', href: '#contact' }
    ]
  },
  {
    label: 'Systems and tools',
    color: 'teal',
    tabs: [
      { name: 'Quiet tools', meta: 'Operator systems', color: 'teal', text: 'Dashboards, intake flows, and small internal systems that keep the work moving without adding noise.' },
      { name: 'Experiments', meta: 'Short runs', color: 'yellow', text: 'Prototypes and live builds that test a direction before it turns into a larger surface.' }
    ]
  },
  {
    label: 'Archive',
    color: 'purple',
    tabs: [
      { name: 'KoHLabs / v1', meta: 'Legacy surface', color: 'purple', text: 'The older experiments stay live. History is useful when it has a door, not when it takes over the lobby.', href: '/legacy' },
      { name: 'Live builds', meta: 'In motion', color: 'black', text: 'A record of things being tested in public, where the unfinished edges are part of the point.', href: '/live' }
    ]
  }
]

const historyGroups = [
  {
    label: 'Community and protocol', color: 'blue', tabs: [
      { name: 'KohX LLC', meta: '2019 to 2024', color: 'blue', text: 'Founded Kindness of Humanity Exchange around proof-of-stake blockchain ideas for charities and impact organizations. Spoke at tech conferences and worked with Blockchain Center Miami on education for mining and cybersecurity basics.', detail: 'Ballwin, Missouri' }
    ]
  },
  {
    label: 'Expressive and technical', color: 'teal', tabs: [
      { name: 'RA Resources', meta: '2009 to 2018', color: 'teal', text: 'Ran device repair and troubleshooting focused on Android hardware, then broadened the business into general electronics support and technical help.', detail: 'Arlington, Texas' }
    ]
  },
  {
    label: 'Operations', color: 'purple', tabs: [
      { name: 'Desktop Disposal', meta: '2008 to 2009', color: 'purple', text: 'Managed sales, inventory, warehouse flow, and refurbished equipment resale through e-commerce channels.', detail: 'Sales, inventory, and resale' },
      { name: 'Pinnacle Solutions', meta: '2002 to 2007', color: 'red', text: 'Handled tech support, file work, customer service, and sales support while building early systems thinking around business and operations.', detail: 'Technical support' }
    ]
  }
]

function FileSystem({ groups, title }) {
  const [active, setActive] = useState({ group: 0, tab: 0 })

  return (
    <div className="file-system" aria-label={title}>
      {groups.map((group, groupIndex) => {
        const isOpen = active.group === groupIndex
        const selected = group.tabs[active.group === groupIndex ? active.tab : 0]
        return (
          <section className={`file-row file-row--${group.color} ${isOpen ? 'is-open' : ''}`} key={group.label}>
            <div className="file-row__tabs">
              {group.tabs.map((tab, tabIndex) => (
                <button
                  className={`file-tab file-tab--${tab.color} ${isOpen && active.tab === tabIndex ? 'is-active' : ''}`}
                  key={tab.name}
                  type="button"
                  onClick={() => setActive({ group: groupIndex, tab: tabIndex })}
                  aria-expanded={isOpen && active.tab === tabIndex}
                >
                  <span>{tab.name}</span><small>{tab.meta}</small>
                </button>
              ))}
              <button className="file-row__label" type="button" onClick={() => setActive({ group: groupIndex, tab: 0 })}>
                {group.label} <span>{isOpen ? '⌃' : '‹'}</span>
              </button>
            </div>
            <div className="file-row__body" aria-hidden={!isOpen}>
              <div className="file-row__body-inner">
                <span className="file-row__number">{String(groupIndex + 1).padStart(2, '0')}</span>
                <div className="file-row__copy"><p className="file-meta">{selected.detail || selected.meta}</p><h3>{selected.name}</h3><p>{selected.text}</p>{selected.href && <a href={selected.href}>Open file <span>↗</span></a>}</div>
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default function Portfolio() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setReady(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  return (
    <div className={`koh-home ${ready ? 'is-ready' : ''}`}>
      <header className="koh-header"><a className="koh-logo" href="/">KOH.LOL FILES</a><nav><a href="#projects">Projects</a><a href="#history">History</a><a href="/resume">Resume</a><a href="#contact">Contact</a></nav></header>
      <main>
        <section className="koh-hero"><div className="koh-hero__inner"><h1>Independent<br />web building</h1><p>A working archive of public surfaces, tools, experiments, and the work that led here.</p><a className="koh-hero__scroll" href="#projects">Open the files <span>↓</span></a></div></section>

        <section className="koh-archive" id="projects"><div className="koh-archive__header"><span>Projects</span><span>03 groups / public work</span></div><FileSystem groups={projectGroups} title="Projects" /></section>
        <section className="koh-archive koh-archive--history" id="history"><div className="koh-archive__header"><span>Work history</span><span>03 groups / 2002 to 2024</span></div><CareerGraph /><FileSystem groups={historyGroups} title="Work history" /></section>

        <section className="koh-contact" id="contact"><p>Have a useful thing in mind?</p><h2>Give it<br /><em>a good shape.</em></h2><a href="mailto:hello@koh.lol">hello@koh.lol <span>↗</span></a></section>
      </main>
      <footer><span>© 2026 koh.lol</span><span>Built with care in Austin</span><a href="/resume">Resume</a><a href="/legacy">Legacy</a></footer>
    </div>
  )
}
