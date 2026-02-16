import { useEffect, useRef, useState, useCallback } from 'react'

/* ═══════════════════════════════════════════════════
   Utilities
   ═══════════════════════════════════════════════════ */

function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, visible]
}

function TypeWriter({ text, speed = 40, delay = 0, enabled = false, onComplete, className = '' }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!enabled) return
    const t = setTimeout(() => {
      setStarted(true)
      let i = 0
      const iv = setInterval(() => {
        i++
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(iv)
          setDone(true)
          onComplete?.()
        }
      }, speed)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(t)
  }, [text, speed, delay, enabled])

  if (!enabled && !started) return <span className={`${className} invisible`}>{text}</span>

  return (
    <span className={className}>
      {displayed}
      {started && !done && (
        <span
          className="inline-block w-[3px] bg-current ml-[1px] align-baseline"
          style={{ height: '0.9em', animation: 'blink 1s step-end infinite' }}
        />
      )}
    </span>
  )
}

function Reveal({ children, className = '', delay = 0, threshold = 0.15, as: Tag = 'div' }) {
  const [ref, vis] = useReveal(threshold)
  return (
    <Tag
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

function Divider({ color = '#00f0ff' }) {
  const [ref, vis] = useReveal(0.5)
  return (
    <div
      ref={ref}
      className={`flex justify-center py-10 md:py-14 transition-all duration-1000 ${
        vis ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="relative">
        <div
          className="w-px h-12 md:h-20"
          style={{
            background: `linear-gradient(to bottom, transparent, ${color}25, transparent)`,
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full"
          style={{ backgroundColor: `${color}40`, boxShadow: `0 0 6px ${color}20` }}
        />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   Manifesto Section
   ═══════════════════════════════════════════════════ */

export default function ManifestoSection() {
  const [declRef, declVis] = useReveal(0.3)
  const [line1Done, setLine1Done] = useState(false)
  const [closingRef, closingVis] = useReveal(0.3)
  const [c1Done, setC1Done] = useState(false)
  const [c2Done, setC2Done] = useState(false)
  const [c3Done, setC3Done] = useState(false)

  return (
    <section id="manifesto" className="relative">
      {/* ── Chapter 1: The Declaration ─────────────── */}
      <div
        ref={declRef}
        className="relative py-28 md:py-44 flex items-center justify-center min-h-[50vh]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.015)_0%,transparent_70%)]" />
        <div className="relative text-center px-6 max-w-4xl mx-auto">
          <Reveal delay={0} threshold={0.3}>
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="h-px w-8 bg-[#00f0ff]/15" />
              <span className="text-[10px] tracking-[0.5em] uppercase text-[#00f0ff]/30 font-['Space_Mono']">
                Manifesto
              </span>
              <div className="h-px w-8 bg-[#00f0ff]/15" />
            </div>
          </Reveal>
          <div className="space-y-3 md:space-y-5">
            <p className="text-2xl md:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white/90 tracking-tight leading-tight">
              <TypeWriter
                text="koH is not a brand."
                speed={50}
                delay={400}
                enabled={declVis}
                onComplete={() => setLine1Done(true)}
              />
            </p>
            <p className="text-2xl md:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold tracking-tight leading-tight text-[#00f0ff]/80">
              <TypeWriter
                text="koH is a practice."
                speed={50}
                delay={300}
                enabled={line1Done}
              />
            </p>
          </div>
        </div>
      </div>

      <Divider />

      {/* ── Chapter 2: The Values ──────────────────── */}
      <div className="relative py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-lg md:text-2xl lg:text-3xl font-['Space_Grotesk'] font-medium text-white/50 leading-relaxed md:leading-relaxed tracking-tight">
              A practice of choosing{' '}
              <span className="text-[#00f0ff]/90 font-semibold">life</span> over
              extraction.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 md:mt-6 text-lg md:text-2xl lg:text-3xl font-['Space_Grotesk'] font-medium text-white/50 leading-relaxed tracking-tight">
              <span className="text-[#00f0ff]/90 font-semibold">Care</span> over
              speed.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <p className="mt-4 md:mt-6 text-lg md:text-2xl lg:text-3xl font-['Space_Grotesk'] font-medium text-white/50 leading-relaxed tracking-tight">
              <span className="text-[#00f0ff]/90 font-semibold">Participation</span>{' '}
              over spectatorship.
            </p>
          </Reveal>
        </div>
      </div>

      <Divider color="#c4a76c" />

      {/* ── Chapter 3: The Belief ──────────────────── */}
      <div className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(196,167,108,0.01)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-6 md:px-12 space-y-8 md:space-y-12">
          <Reveal>
            <p className="text-base md:text-xl lg:text-2xl font-['Inter'] text-white/40 leading-[1.8] md:leading-[1.9]">
              We believe systems should help people{' '}
              <span className="text-white/80 font-medium">flourish</span> —
              not hollow them out.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-base md:text-xl lg:text-2xl font-['Inter'] text-white/40 leading-[1.8] md:leading-[1.9]">
              Technology is not neutral; it carries the values of those who build it.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <p className="text-base md:text-xl lg:text-2xl font-['Inter'] text-white/60 leading-[1.8] md:leading-[1.9] font-medium">
              So we build with{' '}
              <span className="text-[#c4a76c]/80">intention</span>,{' '}
              <span className="text-[#c4a76c]/80">humility</span>, and{' '}
              <span className="text-[#c4a76c]/80">responsibility</span>.
            </p>
          </Reveal>
        </div>
      </div>

      <Divider />

      {/* ── Chapter 4: Working in Public ───────────── */}
      <div className="relative py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xl md:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-white/85 tracking-tight mb-10 md:mb-14">
              koH works in public.
            </p>
          </Reveal>

          <div className="space-y-6 md:space-y-8 border-l border-white/[0.06] pl-6 md:pl-10">
            <Reveal delay={100}>
              <p className="text-sm md:text-base font-['Space_Mono'] text-white/30 leading-[1.9]">
                We learn by doing.
              </p>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-sm md:text-base font-['Space_Mono'] text-white/30 leading-[1.9]">
                We test ideas in the real world and let reality respond.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <p className="text-sm md:text-base font-['Inter'] text-white/45 leading-[1.9] italic">
                Mistakes are not failures — they are information.
              </p>
            </Reveal>
            <Reveal delay={400}>
              <p className="text-sm md:text-base font-['Space_Mono'] text-white/30 leading-[1.9]">
                Process matters as much as outcomes.
              </p>
            </Reveal>
            <Reveal delay={500}>
              <p className="text-sm md:text-base font-['Inter'] text-white/55 leading-[1.9] font-medium">
                Transparency is not a feature; it is an{' '}
                <span className="text-[#00f0ff]/70">ethic</span>.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      <Divider color="#8a5cf5" />

      {/* ── Chapter 5: Community Intelligence ──────── */}
      <div className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(138,92,245,0.015)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xl md:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-white/85 tracking-tight mb-10 md:mb-14">
              We trust community intelligence.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-14">
            {[
              { word: 'Power', rest: 'should be distributed.' },
              { word: 'Credit', rest: 'should be shared.' },
              { word: 'Access', rest: 'should be widened, not gated.' },
            ].map((item, i) => (
              <Reveal key={item.word} delay={i * 200} threshold={0.1}>
                <div className="p-5 md:p-6 border border-white/[0.04] bg-white/[0.01] rounded-sm">
                  <span className="block text-lg md:text-xl font-['Space_Grotesk'] font-semibold text-[#8a5cf5]/70 mb-2">
                    {item.word}
                  </span>
                  <span className="text-[13px] md:text-sm font-['Inter'] text-white/25 leading-relaxed">
                    {item.rest}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={600}>
            <p className="text-sm md:text-base font-['Inter'] text-white/30 leading-[1.9] max-w-xl">
              koH treats funding, tools, and influence as{' '}
              <span className="text-white/60 font-medium">stewardship</span>,
              not status.
            </p>
          </Reveal>
        </div>
      </div>

      <Divider color="#c4a76c" />

      {/* ── Chapter 6: The Question ────────────────── */}
      <div className="relative py-28 md:py-44 flex items-center justify-center min-h-[40vh]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,167,108,0.02)_0%,transparent_60%)]" />
        <div className="relative text-center px-6 max-w-4xl mx-auto">
          <Reveal threshold={0.2}>
            <p className="text-base md:text-lg font-['Space_Mono'] text-white/20 tracking-wide mb-6 md:mb-8">
              The question is never{' '}
              <span className="text-white/40">&ldquo;What can we extract?&rdquo;</span>
            </p>
          </Reveal>
          <Reveal delay={400} threshold={0.2}>
            <p className="text-sm md:text-base font-['Space_Mono'] text-white/25 tracking-wide mb-4 md:mb-6">
              It is always:
            </p>
          </Reveal>
          <Reveal delay={800} threshold={0.2}>
            <p
              className="text-2xl md:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold tracking-tight leading-tight"
              style={{
                background: 'linear-gradient(135deg, #c4a76c, #e8d5a8, #c4a76c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Does this make it easier
              <br />
              for others to do good?
            </p>
          </Reveal>
        </div>
      </div>

      <Divider />

      {/* ── Chapter 7: Play ────────────────────────── */}
      <div className="relative py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-xl md:text-3xl lg:text-4xl font-['Space_Grotesk'] font-bold text-white/85 tracking-tight mb-10 md:mb-14">
              We take play seriously.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-base md:text-lg font-['Inter'] text-white/35 leading-[1.9] mb-8 md:mb-10 max-w-2xl">
              Games, art, ritual, and story are not distractions —
              <br className="hidden md:block" />
              they are how humans{' '}
              <span className="text-white/60">learn</span>,{' '}
              <span className="text-white/60">connect</span>, and{' '}
              <span className="text-white/60">remember what matters</span>.
            </p>
          </Reveal>

          <div className="space-y-4 md:space-y-6">
            {[
              { left: 'Joy', right: 'rigor', connector: 'is not opposed to' },
              { left: 'Meaning', right: 'scale', connector: 'is not opposed to' },
            ].map((pair, i) => (
              <Reveal key={pair.left} delay={400 + i * 200}>
                <p className="text-base md:text-xl font-['Inter'] text-white/30 leading-relaxed">
                  <span className="text-[#00f0ff]/70 font-medium font-['Space_Grotesk']">
                    {pair.left}
                  </span>{' '}
                  {pair.connector}{' '}
                  <span className="text-white/60 font-medium font-['Space_Grotesk']">
                    {pair.right}
                  </span>
                  .
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={800}>
            <p className="mt-10 md:mt-14 text-lg md:text-2xl lg:text-3xl font-['Space_Grotesk'] font-semibold text-white/70 tracking-tight">
              Life is not a resource —{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #c4a76c, #e8d5a8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                it is the point
              </span>
              .
            </p>
          </Reveal>
        </div>
      </div>

      <Divider color="#8a5cf5" />

      {/* ── Chapter 8: Interdependence ─────────────── */}
      <div className="relative py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(138,92,245,0.015)_0%,transparent_60%)]" />
        <div className="relative max-w-3xl mx-auto px-6 md:px-12">
          <Reveal>
            <p className="text-lg md:text-2xl lg:text-3xl font-['Space_Grotesk'] font-semibold text-white/70 tracking-tight leading-relaxed mb-8 md:mb-12">
              koH moves with interdependence in mind:
            </p>
          </Reveal>

          <div className="space-y-4 md:space-y-6 pl-4 md:pl-8 border-l border-[#8a5cf5]/15">
            {[
              ['people', 'land'],
              ['code', 'culture'],
              ['present action', 'future consequence'],
            ].map(([a, b], i) => (
              <Reveal key={a} delay={i * 200}>
                <p className="text-sm md:text-lg font-['Inter'] text-white/25 leading-relaxed">
                  between{' '}
                  <span className="text-[#8a5cf5]/60 font-medium">{a}</span> and{' '}
                  <span className="text-[#8a5cf5]/60 font-medium">{b}</span>,
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={700}>
            <div className="mt-12 md:mt-16 space-y-3 md:space-y-4">
              <p className="text-base md:text-xl font-['Inter'] text-white/40 leading-[1.8]">
                We aim to leave things better than we found them —
              </p>
              <div className="pl-4 md:pl-8 space-y-2 md:space-y-3">
                <p className="text-sm md:text-lg font-['Inter'] text-white/25 leading-relaxed">
                  not perfect,
                </p>
                <p className="text-sm md:text-lg font-['Inter'] text-white/35 leading-relaxed">
                  but more <span className="text-white/55">capable</span>,
                </p>
                <p className="text-sm md:text-lg font-['Inter'] text-white/35 leading-relaxed">
                  more <span className="text-white/55">connected</span>,
                </p>
                <p className="text-sm md:text-lg font-['Inter'] text-white/50 leading-relaxed font-medium">
                  more{' '}
                  <span className="text-[#c4a76c]/80">alive</span>.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <Divider color="#c4a76c" />

      {/* ── Chapter 9: Closing ─────────────────────── */}
      <div
        ref={closingRef}
        className="relative py-28 md:py-44 flex items-center justify-center min-h-[50vh]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,167,108,0.02)_0%,transparent_50%)]" />
        <div className="relative text-center px-6 max-w-4xl mx-auto space-y-4 md:space-y-6">
          <p className="text-2xl md:text-4xl lg:text-5xl font-['Space_Grotesk'] font-bold text-white/90 tracking-tight">
            <TypeWriter
              text="This is koH."
              speed={60}
              delay={300}
              enabled={closingVis}
              onComplete={() => setC1Done(true)}
            />
          </p>
          <p className="text-lg md:text-2xl lg:text-3xl font-['Space_Grotesk'] font-medium text-white/40 tracking-tight">
            <TypeWriter
              text="Still learning."
              speed={55}
              delay={200}
              enabled={c1Done}
              onComplete={() => setC2Done(true)}
            />
          </p>
          <p className="text-lg md:text-2xl lg:text-3xl font-['Space_Grotesk'] font-medium text-white/40 tracking-tight">
            <TypeWriter
              text="Still building."
              speed={55}
              delay={200}
              enabled={c2Done}
              onComplete={() => setC3Done(true)}
            />
          </p>
          <p className="text-lg md:text-2xl lg:text-3xl font-['Space_Grotesk'] font-semibold tracking-tight">
            <TypeWriter
              text="Still choosing life."
              speed={55}
              delay={300}
              enabled={c3Done}
              className="bg-gradient-to-r from-[#c4a76c] via-[#e8d5a8] to-[#c4a76c] bg-clip-text text-transparent"
            />
          </p>
        </div>
      </div>
    </section>
  )
}
