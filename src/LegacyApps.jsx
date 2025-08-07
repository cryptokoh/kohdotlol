import { Link } from 'react-router-dom'
import { useState } from 'react'

function LegacyApps() {
  const [hoveredApp, setHoveredApp] = useState(null)

  const legacyApps = [
    {
      id: 'terminal',
      name: 'Terminal App',
      path: '/legacy/terminal',
      description: 'Original Ubuntu-style terminal interface with file system simulation',
      version: 'v1.0.0',
      date: '2024-08',
      tech: ['React', 'Terminal UI', 'File System'],
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'v001',
      name: 'V0.0.1 Epic Launch',
      path: '/legacy/v0-0-1',
      description: 'The original launch page with 3D effects and animations',
      version: 'v0.0.1',
      date: '2024-07',
      tech: ['React', 'Three.js', 'Framer Motion'],
      color: 'from-purple-400 to-purple-600'
    },
    {
      id: 'defi',
      name: 'DeFi Terminal',
      path: '/legacy/defi',
      description: 'Blockchain and DeFi integration terminal',
      version: 'v1.2.0',
      date: '2024-09',
      tech: ['Solana', 'Web3', 'DeFi'],
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'landing',
      name: 'Original Landing',
      path: '/legacy/landing',
      description: 'The first iteration of the landing page',
      version: 'v0.1.0',
      date: '2024-06',
      tech: ['React', 'Tailwind', 'Animations'],
      color: 'from-orange-400 to-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Main Site
        </Link>
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Legacy Applications
        </h1>
        <p className="text-gray-400 text-lg">
          Explore previous versions and experimental builds of koh.lol
        </p>
      </div>

      {/* Apps Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {legacyApps.map((app) => (
          <Link
            key={app.id}
            to={app.path}
            className="relative group"
            onMouseEnter={() => setHoveredApp(app.id)}
            onMouseLeave={() => setHoveredApp(null)}
          >
            <div className={`
              border-2 border-green-400/30 rounded-lg p-6
              bg-gradient-to-br from-gray-900/50 to-black/50
              backdrop-blur-sm
              transition-all duration-300
              group-hover:border-green-400
              group-hover:shadow-lg group-hover:shadow-green-400/20
              group-hover:transform group-hover:-translate-y-1
            `}>
              {/* Version Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className={`
                  inline-flex items-center gap-2 px-3 py-1 rounded-full
                  bg-gradient-to-r ${app.color} text-black text-xs font-bold
                `}>
                  {app.version}
                </div>
                <span className="text-gray-500 text-xs">{app.date}</span>
              </div>

              {/* App Info */}
              <h2 className="text-2xl font-bold mb-2 text-green-400 group-hover:text-green-300">
                {app.name}
              </h2>
              <p className="text-gray-400 mb-4 text-sm">
                {app.description}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2">
                {app.tech.map((tech) => (
                  <span 
                    key={tech}
                    className="px-2 py-1 bg-green-950/50 border border-green-400/20 rounded text-xs text-green-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Launch Icon */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>

              {/* Hover Effect */}
              {hoveredApp === app.id && (
                <div className="absolute inset-0 rounded-lg pointer-events-none">
                  <div className="absolute inset-0 rounded-lg animate-pulse bg-gradient-to-r from-green-400/10 to-transparent" />
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Archive Notice */}
      <div className="max-w-7xl mx-auto mt-16 p-6 border border-yellow-400/30 rounded-lg bg-yellow-950/20">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-yellow-400 font-bold mb-2">Archive Notice</h3>
            <p className="text-gray-400 text-sm">
              These are legacy applications preserved for historical reference. Some features may no longer 
              work as originally intended. For the best experience, visit the <Link to="/" className="text-green-400 hover:text-green-300">main site</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Terminal-style decoration */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-600 font-mono">
        <div>koh@legacy:~$ ls -la ./apps/</div>
        <div className="animate-pulse">_</div>
      </div>
    </div>
  )
}

export default LegacyApps