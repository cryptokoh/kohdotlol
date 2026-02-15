import { useState, useEffect } from 'react'

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true)
      setTimeout(() => setGlitchActive(false), 150)
    }, 5000 + Math.random() * 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.03)_0%,transparent_70%)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Top line */}
        <div
          className={`transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[11px] tracking-[0.4em] uppercase text-white/25 font-['Space_Mono']">
              Kindness of Humanity
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-white/20" />
          </div>
        </div>

        {/* Main title */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="relative inline-block">
            <span
              className={`text-[clamp(5rem,15vw,12rem)] font-bold leading-[0.85] tracking-tighter text-white/90 font-['Space_Grotesk'] ${
                glitchActive ? 'animate-glitch-1' : ''
              }`}
            >
              koH
            </span>
            {/* Glitch echo layers */}
            {glitchActive && (
              <>
                <span
                  className="absolute inset-0 text-[clamp(5rem,15vw,12rem)] font-bold leading-[0.85] tracking-tighter font-['Space_Grotesk'] text-[#00f0ff]/30"
                  style={{ transform: 'translate(-3px, -2px)' }}
                  aria-hidden="true"
                >
                  koH
                </span>
                <span
                  className="absolute inset-0 text-[clamp(5rem,15vw,12rem)] font-bold leading-[0.85] tracking-tighter font-['Space_Grotesk'] text-[#ff0040]/20"
                  style={{ transform: 'translate(3px, 2px)' }}
                  aria-hidden="true"
                >
                  koH
                </span>
              </>
            )}
          </h1>
        </div>

        {/* Subtitle */}
        <div
          className={`transition-all duration-1000 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="mt-6 text-[13px] md:text-[15px] tracking-[0.2em] uppercase text-white/20 font-['Space_Mono']">
            Lover of Life
          </p>
        </div>

        {/* Decorative line */}
        <div
          className={`transition-all duration-1500 delay-1000 ${
            mounted ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
        >
          <div className="mt-12 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-[#00f0ff]/30 to-transparent" />
        </div>

        {/* Tagline */}
        <div
          className={`transition-all duration-1000 delay-[1200ms] ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="mt-8 text-[13px] md:text-sm leading-relaxed text-white/15 max-w-md mx-auto font-['Inter']">
            Builder. Creator. Human.
            <br />
            The ultimate portfolio — a life lived with purpose.
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-[1800ms] ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[9px] tracking-[0.4em] uppercase text-white/10 font-['Space_Mono']">
              Scroll
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-white/15 to-transparent animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
