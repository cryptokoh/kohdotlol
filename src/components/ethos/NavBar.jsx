import { useState, useEffect } from 'react'

const navLinks = [
  { label: 'Ethos', href: '#ethos' },
  { label: 'Vision', href: '#vision' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Connect', href: '#connect' },
]

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Determine active section
      const sections = navLinks.map(l => l.href.slice(1))
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i])
        if (el && el.getBoundingClientRect().top <= 200) {
          setActiveSection(sections[i])
          return
        }
      }
      setActiveSection('')
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.04]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="group flex items-center gap-3"
          >
            <span className="text-xl md:text-2xl font-bold tracking-tight text-white/90 font-['Space_Grotesk']">
              koH
            </span>
            <span className="hidden sm:block text-[10px] tracking-[0.3em] uppercase text-white/20 font-['Space_Mono'] mt-1">
              .lol
            </span>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollTo(e, link.href)}
                className={`relative px-4 py-2 text-[13px] tracking-[0.15em] uppercase transition-all duration-300 font-['Space_Mono'] ${
                  activeSection === link.href.slice(1)
                    ? 'text-[#00f0ff]'
                    : 'text-white/30 hover:text-white/70'
                }`}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#00f0ff]" />
                )}
              </a>
            ))}
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/20 font-['Space_Mono'] hidden sm:block">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
