import { useEffect, useRef, useState } from 'react'

const links = [
  {
    label: 'Twitter / X',
    handle: '@cryptokoh',
    url: 'https://twitter.com/cryptokoh',
    accent: '#00f0ff',
  },
  {
    label: 'YouTube',
    handle: '@kohlabs',
    url: 'https://youtube.com/@kohlabs',
    accent: '#c4a76c',
  },
  {
    label: 'Twitch',
    handle: 'cryptokoh',
    url: 'https://twitch.tv/cryptokoh',
    accent: '#8a5cf5',
  },
  {
    label: 'GitHub',
    handle: 'cryptokoh',
    url: 'https://github.com/cryptokoh',
    accent: '#00f0ff',
  },
]

export default function ConnectSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="connect" className="relative py-32 md:py-40" ref={ref}>
      {/* Gradient accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(138,92,245,0.02)_0%,transparent_60%)]" />

      <div className="relative max-w-5xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-[#00f0ff]/20" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#00f0ff]/40 font-['Space_Mono']">
              Network
            </span>
          </div>
          <h2
            className={`text-3xl md:text-5xl font-['Space_Grotesk'] font-bold text-white/90 tracking-tight transition-all duration-1000 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Connect
          </h2>
          <p
            className={`mt-4 text-sm text-white/15 font-['Inter'] max-w-lg leading-relaxed transition-all duration-1000 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Find koH across the internet. Building in public, always.
          </p>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {links.map((link, i) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex items-center justify-between p-6 md:p-8 border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all duration-500 rounded-sm ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 150 + 300}ms` }}
            >
              <div>
                <span className="block text-[10px] tracking-[0.3em] uppercase font-['Space_Mono'] text-white/20 mb-2">
                  {link.label}
                </span>
                <span
                  className="text-lg font-['Space_Grotesk'] font-medium transition-colors duration-300"
                  style={{ color: `${link.accent}99` }}
                >
                  {link.handle}
                </span>
              </div>

              {/* Arrow */}
              <div className="text-white/10 group-hover:text-white/30 transition-all duration-300 group-hover:translate-x-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>

              {/* Hover line */}
              <div
                className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-700"
                style={{ backgroundColor: link.accent, opacity: 0.3 }}
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
