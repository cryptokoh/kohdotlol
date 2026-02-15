import { useEffect, useRef, useState } from 'react'

const ethosItems = [
  {
    id: '01',
    title: 'Kindness of Humanity',
    description:
      'Placeholder for your ethos content. What does kindness mean in the digital age? How does humanity express itself through technology and creation?',
    accent: '#00f0ff',
  },
  {
    id: '02',
    title: 'Lover of Life',
    description:
      'Placeholder for your ethos content. Living fully, building relentlessly, and finding joy in the process of creation and connection.',
    accent: '#c4a76c',
  },
  {
    id: '03',
    title: 'Builder\'s Creed',
    description:
      'Placeholder for your ethos content. The philosophy behind building in public — shipping real code, real products, real impact.',
    accent: '#8a5cf5',
  },
]

function EthosCard({ item, index }) {
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
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      {/* Card */}
      <div className="relative p-8 md:p-10 rounded-sm border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/[0.08] transition-all duration-500">
        {/* Corner accents */}
        <div
          className="absolute top-0 left-0 w-8 h-px transition-all duration-500 group-hover:w-12"
          style={{ backgroundColor: item.accent, opacity: 0.4 }}
        />
        <div
          className="absolute top-0 left-0 h-8 w-px transition-all duration-500 group-hover:h-12"
          style={{ backgroundColor: item.accent, opacity: 0.4 }}
        />

        {/* Number */}
        <div className="flex items-center gap-4 mb-6">
          <span
            className="text-[11px] font-['Space_Mono'] tracking-widest"
            style={{ color: item.accent, opacity: 0.6 }}
          >
            {item.id}
          </span>
          <div className="h-px flex-1 bg-white/[0.04]" />
        </div>

        {/* Title */}
        <h3 className="text-xl md:text-2xl font-['Space_Grotesk'] font-semibold text-white/85 mb-4 tracking-tight">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-[1.8] text-white/25 font-['Inter'] max-w-lg">
          {item.description}
        </p>

        {/* Bottom line accent */}
        <div
          className="absolute bottom-0 right-0 w-0 h-px transition-all duration-700 group-hover:w-16"
          style={{ backgroundColor: item.accent, opacity: 0.3 }}
        />
      </div>
    </div>
  )
}

export default function EthosSection() {
  return (
    <section id="ethos" className="relative py-32 md:py-40">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-[#00f0ff]/20" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#00f0ff]/40 font-['Space_Mono']">
              Philosophy
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-['Space_Grotesk'] font-bold text-white/90 tracking-tight">
            The Ethos
          </h2>
          <p className="mt-4 text-sm text-white/15 font-['Inter'] max-w-lg leading-relaxed">
            What drives everything — the principles, the purpose, the path.
          </p>
        </div>

        {/* Ethos cards */}
        <div className="grid gap-6 md:gap-8">
          {ethosItems.map((item, i) => (
            <EthosCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
