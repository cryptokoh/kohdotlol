import { useState, useEffect, useRef } from 'react'
import './LiveStreams.css'

function LiveStreams() {
  const [terminalLines, setTerminalLines] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [streamStatuses, setStreamStatuses] = useState({
    pumpfun: { live: false, viewers: 0, title: '' },
    retake: { live: false, viewers: 0, title: '' },
    youtube: { live: false, viewers: 0, title: '' },
    twitch: { live: false, viewers: 0, title: '' }
  })
  const terminalRef = useRef(null)

  // Streaming platforms configuration
  const platforms = [
    {
      id: 'pumpfun',
      name: 'Pump.fun',
      url: 'https://pump.fun/coin/ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN',
      icon: '🚀',
      color: '#5cbf60',
      description: 'Live token trading & community vibes'
    },
    {
      id: 'retake',
      name: 'Retake.tv',
      url: 'https://retake.tv/kohlabs',
      icon: '📺',
      color: '#ff6b6b',
      description: 'Blockchain streaming platform'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: 'https://youtube.com/@kohlabs',
      icon: '📹',
      color: '#ff0000',
      description: 'Dev streams & tutorials'
    },
    {
      id: 'twitch',
      name: 'Twitch',
      url: 'https://twitch.tv/cryptokoh',
      icon: '🎮',
      color: '#9146ff',
      description: 'Live coding & gaming'
    }
  ]

  // Simulated live status (in production, this would fetch from APIs)
  const checkStreamStatus = () => {
    // Simulate random live status for demo
    const newStatuses = { ...streamStatuses }
    
    platforms.forEach(platform => {
      // Simulate 30% chance of being live
      const isLive = Math.random() > 0.7
      newStatuses[platform.id] = {
        live: isLive,
        viewers: isLive ? Math.floor(Math.random() * 500) + 10 : 0,
        title: isLive ? getRandomStreamTitle() : ''
      }
    })
    
    setStreamStatuses(newStatuses)
  }

  const getRandomStreamTitle = () => {
    const titles = [
      'Building in public - Solana trading bot',
      'Vibe coding session - React Native app',
      'Community AMA - What are we building?',
      'Live debugging - Why is it broken?',
      'AI Agent development stream',
      'Holistic app building - Healing Temple',
      'Base blockchain deployment',
      'Farcaster frame development',
      'Open source library creation',
      'koH Labs late night building'
    ]
    return titles[Math.floor(Math.random() * titles.length)]
  }

  // Terminal boot sequence
  useEffect(() => {
    const bootSequence = [
      { text: 'koH Labs Live Stream Monitor v1.0.0', type: 'system', delay: 100 },
      { text: '=====================================', type: 'divider', delay: 200 },
      { text: 'Initializing stream monitoring system...', type: 'info', delay: 400 },
      { text: 'Connecting to streaming platforms...', type: 'info', delay: 600 },
      { text: '', type: 'blank', delay: 700 },
      { text: '> Checking Pump.fun status...', type: 'command', delay: 900 },
      { text: '> Checking Retake.tv status...', type: 'command', delay: 1100 },
      { text: '> Checking YouTube status...', type: 'command', delay: 1300 },
      { text: '> Checking Twitch status...', type: 'command', delay: 1500 },
      { text: '', type: 'blank', delay: 1600 },
      { text: '✅ All systems online', type: 'success', delay: 1800 },
      { text: '═══════════════════════════════════════════════════════', type: 'divider', delay: 2000 }
    ]

    let index = 0
    const interval = setInterval(() => {
      if (index < bootSequence.length) {
        const line = bootSequence[index]
        setTimeout(() => {
          setTerminalLines(prev => [...prev, line])
          // Auto-scroll
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
          }
        }, line.delay)
        index++
      } else {
        clearInterval(interval)
        // Start checking stream status after boot
        setTimeout(() => {
          checkStreamStatus()
        }, 2500)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Refresh stream status every 30 seconds
  useEffect(() => {
    const interval = setInterval(checkStreamStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="live-streams-container">
      {/* Terminal Header */}
      <div className="terminal-header">
        <div className="terminal-buttons">
          <span className="terminal-btn red"></span>
          <span className="terminal-btn yellow"></span>
          <span className="terminal-btn green"></span>
        </div>
        <div className="terminal-title">koh@kohlabs:~/streams</div>
        <div className="terminal-clock">
          {formatTime(currentTime)}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="terminal-body" ref={terminalRef}>
        {/* Boot sequence lines */}
        {terminalLines.map((line, index) => (
          <div key={index} className={`terminal-line ${line.type}`}>
            {line.text}
          </div>
        ))}

        {/* Stream Status Display */}
        {terminalLines.length >= 11 && (
          <>
            <div className="stream-status-header">
              <span className="header-text">LIVE STREAMING STATUS</span>
              <span className="header-date">{formatDate(currentTime)}</span>
            </div>
            
            <div className="stream-grid">
              {platforms.map(platform => {
                const status = streamStatuses[platform.id]
                return (
                  <div key={platform.id} className={`stream-card ${status.live ? 'live' : 'offline'}`}>
                    <div className="stream-header">
                      <span className="stream-icon">{platform.icon}</span>
                      <span className="stream-name">{platform.name}</span>
                      <span className={`stream-badge ${status.live ? 'live-badge' : 'offline-badge'}`}>
                        {status.live ? '🔴 LIVE' : '⚫ OFFLINE'}
                      </span>
                    </div>
                    
                    <div className="stream-info">
                      {status.live ? (
                        <>
                          <div className="stream-title">{status.title}</div>
                          <div className="stream-viewers">
                            <span className="viewers-icon">👁️</span>
                            <span className="viewers-count">{status.viewers} watching</span>
                          </div>
                        </>
                      ) : (
                        <div className="stream-offline-msg">{platform.description}</div>
                      )}
                    </div>
                    
                    <div className="stream-footer">
                      <a 
                        href={platform.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="stream-link"
                        style={{ '--platform-color': platform.color }}
                      >
                        {status.live ? 'JOIN STREAM →' : 'VISIT CHANNEL →'}
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Terminal Commands */}
            <div className="terminal-commands">
              <div className="command-line">
                <span className="prompt">$</span>
                <span className="command-text">watch -n 30 check_streams --all</span>
                <span className="cursor">▊</span>
              </div>
            </div>

            {/* ASCII Art Footer */}
            <div className="ascii-footer">
              <pre>{`
╔═══════════════════════════════════════════════════════════════╗
║  koH Labs - Building in Public - Streaming Everywhere         ║
║  Degen to Regen • Vibe Coding • Real Builds • Live Streams   ║
╚═══════════════════════════════════════════════════════════════╝
              `}</pre>
            </div>
          </>
        )}
      </div>

      {/* Quick Links Bar */}
      <div className="quick-links-bar">
        <div className="quick-links">
          <a href="/" className="quick-link">🏠 Home</a>
          <a href="https://t.me/koh_labs" target="_blank" rel="noopener noreferrer" className="quick-link">💬 Telegram</a>
          <a href="https://x.com/kohlabs_sol" target="_blank" rel="noopener noreferrer" className="quick-link">🐦 Twitter</a>
          <a href="https://farcaster.xyz/koh" target="_blank" rel="noopener noreferrer" className="quick-link">🟣 Farcaster</a>
        </div>
        <div className="live-indicator">
          {Object.values(streamStatuses).some(s => s.live) && (
            <span className="pulse-dot">🔴 LIVE NOW</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveStreams