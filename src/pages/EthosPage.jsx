import GridBackground from '../components/ethos/GridBackground'
import NavBar from '../components/ethos/NavBar'
import HeroSection from '../components/ethos/HeroSection'
import EthosSection from '../components/ethos/EthosSection'
import VisionSection from '../components/ethos/VisionSection'
import PortfolioSection from '../components/ethos/PortfolioSection'
import ConnectSection from '../components/ethos/ConnectSection'
import Footer from '../components/ethos/Footer'

export default function EthosPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-[#00f0ff]/15 selection:text-white">
      {/* Animated grid background */}
      <GridBackground />

      {/* Subtle noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[1] opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Scan line effect */}
      <div
        className="fixed inset-0 pointer-events-none z-[2] opacity-[0.02]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Navigation */}
      <NavBar />

      {/* Page content */}
      <main className="relative z-10">
        <HeroSection />

        {/* Divider */}
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>

        <EthosSection />

        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>

        <VisionSection />

        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>

        <PortfolioSection />

        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
        </div>

        <ConnectSection />
      </main>

      <Footer />
    </div>
  )
}
