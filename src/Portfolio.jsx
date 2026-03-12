import { useState, useEffect } from 'react'

const ASCII_LOGO = `
██╗  ██╗ ██████╗ ██╗  ██╗   ██╗      ██████╗ ██╗
██║ ██╔╝██╔═══██╗██║  ██║   ██║     ██╔═══██╗██║
█████╔╝ ██║   ██║███████║   ██║     ██║   ██║██║
██╔═██╗ ██║   ██║██╔══██║   ██║     ██║   ██║██║
██║  ██╗╚██████╔╝██║  ██║██╗███████╗╚██████╔╝███████╗
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝ ╚═════╝ ╚══════╝
`.trim()

const MINIMAL_LOGO = `
┌─────────────────────────────────────────────────┐
│  ▄ ▄▀▀ ▄  ▄     ▄   ▄▀▀ ▄                      │
│  █▀▄ █▀█ █▀█ ▀ █   █▀█ █                       │
│  ▀ ▀ ▀▀▀ ▀ ▀   ▀▀▀ ▀▀▀ ▀▀▀                     │
└─────────────────────────────────────────────────┘
`.trim()

const CLEAN_LOGO = `
 ┬┌─┌─┐┬ ┬   ┬  ┌─┐┬
 ├┴┐│ ││ │   │  │ ││
 ┴ ┴└─┘└─┘ o └─┘└─┘┴─┘
`.trim()

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false)
  const [showEthos, setShowEthos] = useState(false)

  useEffect(() => {
    // Fade in the header
    setTimeout(() => setLoaded(true), 100)
    // Then show the ethos
    setTimeout(() => setShowEthos(true), 800)
  }, [])

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Angled corner accent - elite style diagonal cut */}
      <div
        className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-teal-100 to-teal-200"
        style={{
          clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
        }}
      />

      {/* Subtle corner line detail */}
      <div
        className="absolute top-0 right-0 w-48 h-48 border-l-2 border-teal-300 opacity-60"
        style={{
          transform: 'rotate(45deg)',
          transformOrigin: 'top right',
          right: '68px',
          top: '-68px'
        }}
      />

      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24">

        {/* ASCII Header */}
        <header
          className={`transition-all duration-1000 ease-out ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <pre
            className="font-mono text-teal-400 text-[8px] sm:text-[10px] md:text-xs lg:text-sm leading-tight tracking-tighter select-none"
            style={{
              textShadow: '0 0 20px rgba(94, 234, 212, 0.3)',
              letterSpacing: '-0.05em'
            }}
          >
            {CLEAN_LOGO}
          </pre>

          {/* Subtle underline accent */}
          <div className="mt-4 w-24 h-px bg-gradient-to-r from-teal-300 to-transparent" />
        </header>

        {/* Ethos Section */}
        <section
          className={`mt-16 max-w-2xl transition-all duration-1000 delay-300 ease-out ${
            showEthos ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-teal-600 text-lg md:text-xl font-light leading-relaxed tracking-wide">
            building tools for humans
          </p>

          <p className="mt-6 text-teal-400 text-sm md:text-base font-light leading-relaxed opacity-80">
            developer · systems thinker · community builder
          </p>

          {/* Minimal nav hints */}
          <nav className="mt-16 flex gap-8 text-teal-300 text-xs font-mono uppercase tracking-widest">
            <span className="hover:text-teal-500 cursor-pointer transition-colors">
              [ work ]
            </span>
            <span className="hover:text-teal-500 cursor-pointer transition-colors">
              [ about ]
            </span>
            <span className="hover:text-teal-500 cursor-pointer transition-colors">
              [ connect ]
            </span>
          </nav>
        </section>

        {/* Bottom corner detail - mirroring elite asymmetry */}
        <div className="absolute bottom-8 left-8 flex items-center gap-3 text-teal-200 text-xs font-mono">
          <span className="opacity-40">───</span>
          <span className="opacity-60">2025</span>
        </div>

        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(94, 234, 212, 1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(94, 234, 212, 1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Small angled accent bottom left */}
      <div
        className="absolute bottom-0 left-0 w-32 h-32 border-t border-teal-100"
        style={{
          clipPath: 'polygon(0 100%, 0 0, 100% 100%)'
        }}
      />
    </div>
  )
}
