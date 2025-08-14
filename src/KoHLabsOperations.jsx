import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './KoHLabsOperations.css'

function KoHLabsOperations() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [matrixMode, setMatrixMode] = useState(false)
  const canvasRef = useRef(null)
  const matrixRainRef = useRef(null)

  // Matrix Rain Effect (subtle)
  const initMatrixRain = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    
    const matrix = "01"
    const matrixArray = matrix.split("")
    
    const fontSize = 10
    const columns = canvas.width / fontSize
    
    const drops = []
    for(let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100
    }
    
    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = 'rgba(138, 226, 52, 0.3)'
      ctx.font = fontSize + 'px monospace'
      
      for(let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        if(drops[i] * fontSize > canvas.height && Math.random() > 0.985) {
          drops[i] = 0
        }
        drops[i]++
      }
    }
    
    return setInterval(draw, 50)
  }

  useEffect(() => {
    if (matrixMode) {
      matrixRainRef.current = initMatrixRain()
    } else if (matrixRainRef.current) {
      clearInterval(matrixRainRef.current)
      const ctx = canvasRef.current?.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      }
    }
  }, [matrixMode])

  // Sample data for operations
  const stats = {
    holders: '1,337',
    marketCap: '$420.69K',
    volume24h: '$69.42K',
    liquidity: '$25.5K',
    price: '$0.000314',
    priceChange: '+15.42%'
  }

  const activities = [
    { time: '2 min ago', action: 'New holder joined', detail: 'Wallet ...abc bought 1.5M $koHLabs' },
    { time: '5 min ago', action: 'Live stream started', detail: 'koH is building AI agents live' },
    { time: '15 min ago', action: 'Community milestone', detail: 'Reached 1,000 Telegram members' },
    { time: '1 hour ago', action: 'Development update', detail: 'Claude integration deployed' },
    { time: '2 hours ago', action: 'Token burn', detail: '10M tokens burned 🔥' }
  ]

  const projects = [
    { name: 'AI Agent Framework', status: 'In Progress', progress: 75 },
    { name: 'Trading Bot v2', status: 'Testing', progress: 90 },
    { name: 'Community Dashboard', status: 'Planning', progress: 25 },
    { name: 'Mobile App', status: 'Development', progress: 40 }
  ]

  return (
    <div className={`operations-page ${matrixMode ? 'matrix-mode' : ''}`}>
      {/* Matrix Canvas */}
      <canvas ref={canvasRef} className="matrix-canvas" />

      {/* Feature Banner */}
      <div className="feature-banner">
        <div className="feature-banner-content">
          <span className="feature-badge">🚀 COMING SOON</span>
          <span className="feature-text">Live market data integration with Jupiter API • Real-time holder tracking • Advanced analytics dashboard</span>
        </div>
      </div>

      {/* Header */}
      <header className="ops-header">
        <div className="ops-header-container">
          <Link to="/" className="ops-logo">
            <span className="logo-symbol">$</span>koHLabs
          </Link>
          <div className="ops-title">Operations Center</div>
          <div className="ops-actions">
            <button 
              className={`matrix-toggle ${matrixMode ? 'active' : ''}`}
              onClick={() => setMatrixMode(!matrixMode)}
              title="Toggle Matrix Mode"
            >
              {matrixMode ? '◉' : '○'}
            </button>
            <Link to="/" className="back-btn">Back to Main</Link>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="ops-nav">
        <button 
          className={`ops-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`ops-tab ${activeTab === 'community' ? 'active' : ''}`}
          onClick={() => setActiveTab('community')}
        >
          👥 Community
        </button>
        <button 
          className={`ops-tab ${activeTab === 'development' ? 'active' : ''}`}
          onClick={() => setActiveTab('development')}
        >
          💻 Development
        </button>
        <button 
          className={`ops-tab ${activeTab === 'treasury' ? 'active' : ''}`}
          onClick={() => setActiveTab('treasury')}
        >
          💰 Treasury
        </button>
        <button 
          className={`ops-tab ${activeTab === 'streams' ? 'active' : ''}`}
          onClick={() => setActiveTab('streams')}
        >
          🎬 Live Streams
        </button>
      </nav>

      {/* Content Area */}
      <main className="ops-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Holders</div>
                <div className="stat-value">{stats.holders}</div>
                <div className="stat-change positive">+42 today</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Market Cap</div>
                <div className="stat-value">{stats.marketCap}</div>
                <div className="stat-change positive">{stats.priceChange}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">24h Volume</div>
                <div className="stat-value">{stats.volume24h}</div>
                <div className="stat-change">↔️ Trading</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Liquidity</div>
                <div className="stat-value">{stats.liquidity}</div>
                <div className="stat-change">🔒 Locked</div>
              </div>
              <div className="stat-card highlight">
                <div className="stat-label">Price</div>
                <div className="stat-value">{stats.price}</div>
                <div className="stat-change positive">{stats.priceChange}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Live Status</div>
                <div className="stat-value">🔴 LIVE</div>
                <div className="stat-change">koH streaming</div>
              </div>
            </div>

            {/* Live Chart Section */}
            <div className="chart-section">
              <h2>Market Performance</h2>
              <div className="chart-container">
                <div className="chart-placeholder">
                  <div className="chart-grid">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="chart-bar" style={{
                        height: `${Math.random() * 60 + 20}%`,
                        animationDelay: `${i * 0.1}s`
                      }} />
                    ))}
                  </div>
                  <div className="chart-overlay">
                    <span className="chart-label">📈 Live Market Data Coming Soon</span>
                  </div>
                </div>
                <div className="chart-stats">
                  <div className="chart-stat">
                    <span className="chart-stat-label">24h High</span>
                    <span className="chart-stat-value">$0.000420</span>
                  </div>
                  <div className="chart-stat">
                    <span className="chart-stat-label">24h Low</span>
                    <span className="chart-stat-value">$0.000269</span>
                  </div>
                  <div className="chart-stat">
                    <span className="chart-stat-label">ATH</span>
                    <span className="chart-stat-value">$0.000690</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="activity-section">
              <h2>Recent Activity</h2>
              <div className="activity-feed">
                {activities.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-time">{activity.time}</div>
                    <div className="activity-content">
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-detail">{activity.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Overview */}
            <div className="projects-section">
              <h2>Active Projects</h2>
              <div className="projects-list">
                {projects.map((project, index) => (
                  <div key={index} className="project-item">
                    <div className="project-header">
                      <div className="project-name">{project.name}</div>
                      <div className={`project-status status-${project.status.toLowerCase().replace(' ', '-')}`}>
                        {project.status}
                      </div>
                    </div>
                    <div className="project-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <div className="progress-text">{project.progress}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'community' && (
          <div className="community-content">
            <h2>Community Hub</h2>
            <div className="community-grid">
              <div className="community-card">
                <h3>📱 Telegram</h3>
                <div className="community-stat">1,042 members</div>
                <a href="https://t.me/cryptokoh" target="_blank" rel="noopener noreferrer" className="community-link">
                  Join Chat →
                </a>
              </div>
              <div className="community-card">
                <h3>🐦 X (Twitter)</h3>
                <div className="community-stat">2,337 followers</div>
                <a href="https://x.com/crypto_koh" target="_blank" rel="noopener noreferrer" className="community-link">
                  Follow →
                </a>
              </div>
              <div className="community-card">
                <h3>💎 Holders</h3>
                <div className="community-stat">{stats.holders} diamond hands</div>
                <div className="community-link">Growing daily</div>
              </div>
              <div className="community-card">
                <h3>🎬 Live Viewers</h3>
                <div className="community-stat">156 watching now</div>
                <div className="community-link">Join stream</div>
              </div>
            </div>

            <div className="community-events">
              <h3>Upcoming Events</h3>
              <ul>
                <li>🎮 Gaming Night - Friday 9PM UTC</li>
                <li>💻 Live Coding Session - Saturday 2PM UTC</li>
                <li>🎙️ AMA with koH - Sunday 6PM UTC</li>
                <li>🚀 Feature Launch - Next Tuesday</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'development' && (
          <div className="development-content">
            <h2>Development Pipeline</h2>
            <div className="dev-sections">
              <div className="dev-section">
                <h3>🚧 In Progress</h3>
                <ul>
                  <li>AI Agent Framework v2.0</li>
                  <li>Solana Trading Bot Optimization</li>
                  <li>Community Dashboard</li>
                  <li>Mobile App UI/UX</li>
                </ul>
              </div>
              <div className="dev-section">
                <h3>🧪 Testing</h3>
                <ul>
                  <li>Jupiter Integration v6</li>
                  <li>Wallet Multi-sig Support</li>
                  <li>Real-time Analytics</li>
                </ul>
              </div>
              <div className="dev-section">
                <h3>📋 Planned</h3>
                <ul>
                  <li>NFT Collection Launch</li>
                  <li>DAO Governance System</li>
                  <li>Cross-chain Bridge</li>
                  <li>Advanced AI Features</li>
                </ul>
              </div>
              <div className="dev-section">
                <h3>✅ Completed</h3>
                <ul>
                  <li>Website Launch</li>
                  <li>Token Deployment</li>
                  <li>Initial Liquidity</li>
                  <li>Community Setup</li>
                </ul>
              </div>
            </div>

            <div className="github-stats">
              <h3>GitHub Activity</h3>
              <div className="github-grid">
                <div className="github-stat">
                  <span className="github-number">247</span>
                  <span className="github-label">Commits this month</span>
                </div>
                <div className="github-stat">
                  <span className="github-number">15</span>
                  <span className="github-label">Active repos</span>
                </div>
                <div className="github-stat">
                  <span className="github-number">42</span>
                  <span className="github-label">Contributors</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'treasury' && (
          <div className="treasury-content">
            <h2>Treasury Overview</h2>
            <div className="treasury-stats">
              <div className="treasury-card">
                <h3>💼 Total Value</h3>
                <div className="treasury-value">$42,069</div>
                <div className="treasury-detail">Across all assets</div>
              </div>
              <div className="treasury-card">
                <h3>💧 Liquidity Pool</h3>
                <div className="treasury-value">$25,500</div>
                <div className="treasury-detail">Locked for 6 months</div>
              </div>
              <div className="treasury-card">
                <h3>🏦 Development Fund</h3>
                <div className="treasury-value">$10,000</div>
                <div className="treasury-detail">For ongoing development</div>
              </div>
              <div className="treasury-card">
                <h3>🎁 Community Rewards</h3>
                <div className="treasury-value">$6,569</div>
                <div className="treasury-detail">Airdrops & contests</div>
              </div>
            </div>

            <div className="allocation-chart">
              <h3>Token Allocation</h3>
              <div className="allocation-items">
                <div className="allocation-item">
                  <span className="allocation-label">Liquidity</span>
                  <div className="allocation-bar">
                    <div className="allocation-fill" style={{ width: '40%' }} />
                  </div>
                  <span className="allocation-percent">40%</span>
                </div>
                <div className="allocation-item">
                  <span className="allocation-label">Community</span>
                  <div className="allocation-bar">
                    <div className="allocation-fill" style={{ width: '30%' }} />
                  </div>
                  <span className="allocation-percent">30%</span>
                </div>
                <div className="allocation-item">
                  <span className="allocation-label">Development</span>
                  <div className="allocation-bar">
                    <div className="allocation-fill" style={{ width: '20%' }} />
                  </div>
                  <span className="allocation-percent">20%</span>
                </div>
                <div className="allocation-item">
                  <span className="allocation-label">Marketing</span>
                  <div className="allocation-bar">
                    <div className="allocation-fill" style={{ width: '10%' }} />
                  </div>
                  <span className="allocation-percent">10%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'streams' && (
          <div className="streams-content">
            <h2>Live Streaming Hub</h2>
            
            <div className="stream-status">
              <div className="stream-live">
                <span className="live-indicator">🔴</span>
                <div className="live-info">
                  <h3>Currently Live</h3>
                  <p>Building AI Agents with Claude</p>
                  <div className="viewer-count">156 viewers</div>
                </div>
                <a href="https://pump.koh.lol" target="_blank" rel="noopener noreferrer" className="watch-btn">Watch Now →</a>
              </div>
            </div>

            <div className="stream-schedule">
              <h3>Stream Schedule</h3>
              <div className="schedule-grid">
                <div className="schedule-item">
                  <div className="schedule-day">Monday</div>
                  <div className="schedule-time">2PM - 6PM UTC</div>
                  <div className="schedule-topic">Open Development</div>
                </div>
                <div className="schedule-item">
                  <div className="schedule-day">Wednesday</div>
                  <div className="schedule-time">3PM - 7PM UTC</div>
                  <div className="schedule-topic">Trading Bot Development</div>
                </div>
                <div className="schedule-item">
                  <div className="schedule-day">Friday</div>
                  <div className="schedule-time">4PM - 8PM UTC</div>
                  <div className="schedule-topic">Community Projects</div>
                </div>
                <div className="schedule-item">
                  <div className="schedule-day">Saturday</div>
                  <div className="schedule-time">2PM - 5PM UTC</div>
                  <div className="schedule-topic">AI Agent Training</div>
                </div>
              </div>
            </div>

            <div className="stream-highlights">
              <h3>Recent Highlights</h3>
              <div className="highlights-grid">
                <div className="highlight-card">
                  <div className="highlight-title">Solana Bot Goes Live</div>
                  <div className="highlight-views">2.3K views</div>
                </div>
                <div className="highlight-card">
                  <div className="highlight-title">Building Claude Integration</div>
                  <div className="highlight-views">1.8K views</div>
                </div>
                <div className="highlight-card">
                  <div className="highlight-title">Community AMA #3</div>
                  <div className="highlight-views">1.5K views</div>
                </div>
                <div className="highlight-card">
                  <div className="highlight-title">Trading Strategy Deep Dive</div>
                  <div className="highlight-views">3.1K views</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="ops-footer">
        <div className="footer-content">
          <div className="footer-left">
            <p>$koHLabs Operations Center • Building in Public</p>
          </div>
          <div className="footer-right">
            <a href="https://t.me/cryptokoh" target="_blank" rel="noopener noreferrer">Telegram</a>
            <a href="https://x.com/crypto_koh" target="_blank" rel="noopener noreferrer">X</a>
            <a href="https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN" target="_blank" rel="noopener noreferrer">Pump.fun</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default KoHLabsOperations