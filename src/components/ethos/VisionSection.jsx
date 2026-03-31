import { useEffect, useRef, useState } from 'react'

const visionPillars = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: 'Create',
    description: 'Building tools, experiences, and communities that push boundaries.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: 'Connect',
    description: 'Human connection first. Technology as the bridge, never the barrier.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Impact',
    description: 'Shipping real work that matters. Code, content, and community.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    title: 'Evolve',
    description: 'Constant growth. From degen to regen — always leveling up.',
  },
]

function PillarCard({ pillar, index }) {
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
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`group relative transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="relative h-full p-6 md:p-8 border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 rounded-sm">
        {/* Icon */}
        <div className="text-[#00f0ff]/40 mb-5 group-hover:text-[#00f0ff]/70 transition-colors duration-500">
          {pillar.icon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-['Space_Grotesk'] font-semibold text-white/80 mb-3 tracking-tight">
          {pillar.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] leading-[1.8] text-white/20 font-['Inter']">
          {pillar.description}
        </p>

        {/* Hover accent line */}
        <div className="absolute bottom-0 left-0 w-0 h-px bg-[#00f0ff]/20 group-hover:w-full transition-all duration-700" />
      </div>
    </div>
  )
}

export default function VisionSection() {
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
    <section id="vision" className="relative py-32 md:py-40" ref={ref}>
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,240,255,0.02)_0%,transparent_60%)]" />

      <div className="relative max-w-5xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-[#c4a76c]/20" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#c4a76c]/40 font-['Space_Mono']">
              Direction
            </span>
          </div>
          <h2
            className={`text-3xl md:text-5xl font-['Space_Grotesk'] font-bold text-white/90 tracking-tight transition-all duration-1000 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            The Vision
          </h2>
          <p
            className={`mt-4 text-sm text-white/15 font-['Inter'] max-w-lg leading-relaxed transition-all duration-1000 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Four pillars that shape every project, every decision, every line of code.
          </p>
        </div>

        {/* Pillar grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {visionPillars.map((pillar, i) => (
            <PillarCard key={pillar.title} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
