import { useState } from 'react'

function MissionSection() {
  const [activeCard, setActiveCard] = useState(0)

  const missionCards = [
    { icon: '🔄', title: 'Degen to Regen', desc: 'Transforming degen energy into regenerative building. We\'re taking projects from zero to something, one vibe-coded line at a time.' },
    { icon: '🎬', title: 'Live Stream Coding', desc: 'Real people, real ops, real builds. Watch us write code we barely understand, debug in public, and celebrate when things actually work.' },
    { icon: '🤖', title: 'AI Agent Building', desc: 'Creating AI agents that do... things. Sometimes useful things. Always interesting things. Join us in the experimental zone.' },
    { icon: '⚡', title: 'Solana Exploration', desc: 'Collaborative discovery of the Sol ecosystem. We\'re learning together, building together, and probably breaking things together.' },
    { icon: '🛠️', title: 'Project Support', desc: 'Helping other projects go from idea to reality. Because koH believes in lifting while climbing, even when we\'re not sure where we\'re going.' },
    { icon: '🎯', title: 'Vibe Coding', desc: 'Hardcore vibe coding sessions where the energy is high, the code is questionable, and the learning never stops. This is how we roll.' }
  ]

  return (
    <section id="mission" className="mission">
      <div className="mission-content">
        <h2 className="section-title">Our Mission</h2>
        <p className="section-subtitle">Building in public, learning together, vibing always</p>
        <div className="mission-grid">
          {missionCards.map((card, index) => (
            <div 
              key={index} 
              className={`mission-card ${activeCard === index ? 'active' : ''}`}
              onMouseEnter={() => setActiveCard(index)}
            >
              <div className="mission-icon">{card.icon}</div>
              <h3 className="mission-title">{card.title}</h3>
              <p className="mission-desc">{card.desc}</p>
              <div className="mission-glow"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MissionSection