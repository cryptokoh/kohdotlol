import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './PersonalLanding.css'

function PersonalLanding() {
  const [matrixMode, setMatrixMode] = useState(false)
  const canvasRef = useRef(null)
  const matrixRainRef = useRef(null)

  // Matrix Rain Effect
  const initMatrixRain = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const matrix = "01"
    const matrixArray = matrix.split("")
    
    const fontSize = 14
    const columns = canvas.width / fontSize
    
    const drops = []
    for(let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100
    }
    
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#8ae234'
      ctx.font = fontSize + 'px monospace'
      
      for(let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }
    
    return setInterval(draw, 35)
  }

  const toggleMatrix = () => {
    setMatrixMode(!matrixMode)
    
    if (!matrixMode) {
      matrixRainRef.current = initMatrixRain()
    } else {
      if (matrixRainRef.current) {
        clearInterval(matrixRainRef.current)
        matrixRainRef.current = null
      }
      
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (matrixMode && canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [matrixMode])

  return (
    <div className={`personal-landing ${matrixMode ? 'matrix-mode' : ''}`}>
      {/* Matrix Rain Canvas */}
      <canvas ref={canvasRef} className="matrix-canvas" />
      
      {/* Matrix Toggle */}
      <button 
        className="matrix-toggle-btn"
        onClick={toggleMatrix}
        title={matrixMode ? "Exit the Matrix" : "Enter the Matrix"}
      >
        {matrixMode ? 'EXIT' : 'MATRIX'}
      </button>

      {/* Navigation */}
      <nav className="personal-nav">
        <div className="nav-container">
          <a href="#" className="logo">koH</a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#connect">Connect</a>
            <Link to="/kohlabs" className="highlight-link">$koHLabs</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="glitch-text" data-text="koH">koH</h1>
          <p className="tagline">Builder • Vibe Coder • Stream Creator</p>
          <p className="sub-tagline">Building in public, learning in real-time</p>
          
          <div className="hero-links">
            <Link to="/kohlabs" className="hero-btn primary">
              <span>🚀</span> $koHLabs Project
            </Link>
            <a href="#projects" className="hero-btn secondary">
              <span>🛠️</span> View Projects
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <h2>About koH</h2>
          <div className="about-content">
            <p>
              Live streaming the journey from ideas to implementation. Building AI agents, 
              supporting projects, and writing code we barely understand—together.
            </p>
            <p>
              From degen to regen, helping projects go from zero to something. 
              Because koH don't know, but koH builds anyway.
            </p>
            <div className="skills-grid">
              <div className="skill-card">
                <span className="skill-icon">🤖</span>
                <h3>AI Development</h3>
                <p>Building AI agents and automation tools</p>
              </div>
              <div className="skill-card">
                <span className="skill-icon">⛓️</span>
                <h3>Blockchain</h3>
                <p>Solana ecosystem, DeFi, and trading bots</p>
              </div>
              <div className="skill-card">
                <span className="skill-icon">🎬</span>
                <h3>Live Streaming</h3>
                <p>Coding sessions and project development</p>
              </div>
              <div className="skill-card">
                <span className="skill-icon">🚀</span>
                <h3>Open Source</h3>
                <p>Building and supporting community projects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="projects-section">
        <div className="section-container">
          <h2>Featured Projects</h2>
          <div className="projects-grid">
            <Link to="/kohlabs" className="project-card featured">
              <div className="project-header">
                <span className="project-icon">💎</span>
                <span className="project-badge">LIVE</span>
              </div>
              <h3>$koHLabs</h3>
              <p>Community-driven Solana project with live development streams</p>
              <div className="project-tags">
                <span>Solana</span>
                <span>DeFi</span>
                <span>Community</span>
              </div>
            </Link>
            
            <a href="https://github.com/cryptokoh" target="_blank" rel="noopener noreferrer" className="project-card">
              <div className="project-header">
                <span className="project-icon">🤖</span>
              </div>
              <h3>AI Agents</h3>
              <p>Building intelligent agents for automation and assistance</p>
              <div className="project-tags">
                <span>AI</span>
                <span>Automation</span>
                <span>Claude</span>
              </div>
            </a>
            
            <a href="#" className="project-card">
              <div className="project-header">
                <span className="project-icon">📈</span>
              </div>
              <h3>Trading Bots</h3>
              <p>Automated trading systems for Solana ecosystem</p>
              <div className="project-tags">
                <span>Trading</span>
                <span>Jupiter</span>
                <span>Bots</span>
              </div>
            </a>
            
            <a href="#" className="project-card">
              <div className="project-header">
                <span className="project-icon">🎥</span>
              </div>
              <h3>Stream Tools</h3>
              <p>Tools and utilities for live coding streams</p>
              <div className="project-tags">
                <span>Streaming</span>
                <span>Tools</span>
                <span>Content</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section id="connect" className="connect-section">
        <div className="section-container">
          <h2>Let's Connect</h2>
          <p className="connect-subtitle">Join the journey, contribute to projects, or just say hi</p>
          
          <div className="connect-grid">
            <a href="https://t.me/cryptokoh" target="_blank" rel="noopener noreferrer" className="connect-card">
              <span className="connect-icon">💬</span>
              <h3>Telegram</h3>
              <p>@cryptokoh</p>
            </a>
            
            <a href="https://x.com/crypto_koh" target="_blank" rel="noopener noreferrer" className="connect-card">
              <span className="connect-icon">🐦</span>
              <h3>X (Twitter)</h3>
              <p>@crypto_koh</p>
            </a>
            
            <a href="https://github.com/cryptokoh" target="_blank" rel="noopener noreferrer" className="connect-card">
              <span className="connect-icon">💻</span>
              <h3>GitHub</h3>
              <p>@cryptokoh</p>
            </a>
            
            <Link to="/kohlabs" className="connect-card highlight">
              <span className="connect-icon">🚀</span>
              <h3>$koHLabs</h3>
              <p>Join the community</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="personal-footer">
        <div className="footer-container">
          <p>© 2024 koH • Building in Public • Powered by Curiosity</p>
          <p className="footer-motto">koH don't know, but koH builds anyway</p>
        </div>
      </footer>
    </div>
  )
}

export default PersonalLanding