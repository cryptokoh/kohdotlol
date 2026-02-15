import { useEffect, useRef, useState } from 'react'

const projects = [
  {
    tag: 'DeFi',
    title: 'Project Title',
    description: 'Placeholder — describe your project here. What was built, why it matters, and the impact it made.',
    tech: ['React', 'Solana', 'Web3'],
    accent: '#00f0ff',
    status: 'Live',
  },
  {
    tag: 'Community',
    title: 'Project Title',
    description: 'Placeholder — another project showcase. Your best work, front and center.',
    tech: ['Node.js', 'WebSocket', 'AI'],
    accent: '#8a5cf5',
    status: 'Building',
  },
  {
    tag: 'Content',
    title: 'Project Title',
    description: 'Placeholder — content creation, streaming, community building. The human side of tech.',
    tech: ['Live', 'YouTube', 'Twitch'],
    accent: '#c4a76c',
    status: 'Ongoing',
  },
]

function ProjectCard({ project, index }) {
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
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`group relative transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${index * 200}ms` }}
    >
      <div className="relative h-full border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/[0.08] transition-all duration-500 rounded-sm overflow-hidden">
        {/* Top accent bar */}
        <div
          className="h-px w-full"
          style={{ background: `linear-gradient(90deg, ${project.accent}33, transparent)` }}
        />

        <div className="p-8 md:p-10">
          {/* Tag and status */}
          <div className="flex items-center justify-between mb-6">
            <span
              className="text-[10px] tracking-[0.3em] uppercase font-['Space_Mono']"
              style={{ color: project.accent, opacity: 0.6 }}
            >
              {project.tag}
            </span>
            <span className="flex items-center gap-2">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: project.accent, opacity: 0.5 }}
              />
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/15 font-['Space_Mono']">
                {project.status}
              </span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl md:text-2xl font-['Space_Grotesk'] font-semibold text-white/80 mb-4 tracking-tight group-hover:text-white/95 transition-colors duration-300">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-[13px] leading-[1.8] text-white/20 font-['Inter'] mb-8">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-3 py-1 text-[10px] tracking-[0.15em] uppercase font-['Space_Mono'] border border-white/[0.06] text-white/20 rounded-sm"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom hover line */}
        <div
          className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-700"
          style={{ backgroundColor: project.accent, opacity: 0.3 }}
        />
      </div>
    </div>
  )
}

export default function PortfolioSection() {
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
    <section id="portfolio" className="relative py-32 md:py-40" ref={ref}>
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-[#8a5cf5]/20" />
            <span className="text-[10px] tracking-[0.4em] uppercase text-[#8a5cf5]/40 font-['Space_Mono']">
              Work
            </span>
          </div>
          <h2
            className={`text-3xl md:text-5xl font-['Space_Grotesk'] font-bold text-white/90 tracking-tight transition-all duration-1000 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            The Portfolio
          </h2>
          <p
            className={`mt-4 text-sm text-white/15 font-['Inter'] max-w-lg leading-relaxed transition-all duration-1000 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            A curated selection of builds, experiments, and shipped products.
          </p>
        </div>

        {/* Project grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={i} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
