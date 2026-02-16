export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.03]">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            <span className="text-lg font-['Space_Grotesk'] font-bold text-white/40 tracking-tight">
              koH
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/10 font-['Space_Mono']">
              .lol
            </span>
          </div>

          {/* Center */}
          <p className="text-[11px] tracking-[0.15em] text-white/10 font-['Space_Mono'] text-center">
            Kindness of Humanity &middot; Lover of Life
          </p>

          {/* Right */}
          <div className="flex items-center gap-4">
            <a
              href="/legacy"
              className="text-[10px] tracking-[0.2em] uppercase text-white/10 hover:text-white/30 font-['Space_Mono'] transition-colors duration-300"
            >
              Legacy Site
            </a>
            <div className="w-px h-3 bg-white/[0.06]" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/10 font-['Space_Mono']">
              2026
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
