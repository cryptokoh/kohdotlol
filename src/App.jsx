import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Portfolio from './Portfolio'

// Lazy load other pages
const KoHLabsExact = lazy(() => import('./KoHLabsExact'))
const PersonalLanding = lazy(() => import('./PersonalLanding'))
const TerminalApp = lazy(() => import('./TerminalApp'))
const V001EpicLaunch = lazy(() => import('./V001EpicLaunch'))
const NewApp = lazy(() => import('./NewApp'))
const DeFiTerminal = lazy(() => import('./defi/DeFiTerminal'))
const LegacyApps = lazy(() => import('./LegacyApps'))
const KoHLabsOperations = lazy(() => import('./KoHLabsOperations'))
const ZoraCoinPage = lazy(() => import('./ZoraCoinPage'))
const LegacyProviders = lazy(() => import('./LegacyProviders'))

function App() {
  return (
    <Router>
      <Routes>
        {/* New ethos homepage */}
        <Route path="/" element={<Portfolio />} />

        {/* v1 - previous KoHLabs landing */}
        <Route path="/v1" element={
          <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-green-400 text-2xl font-mono animate-pulse">
                Loading KoHLabs...
              </div>
            </div>
          }>
            <KoHLabsExact />
          </Suspense>
        } />

        {/* Personal portfolio page */}
        <Route path="/koh" element={
          <Suspense fallback={null}>
            <PersonalLanding />
          </Suspense>
        } />

        {/* KoHLabs operations page */}
        <Route path="/operations" element={
          <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-green-400 text-2xl font-mono animate-pulse">
                Loading KoHLabs Operations...
              </div>
            </div>
          }>
            <KoHLabsOperations />
          </Suspense>
        } />

        {/* Zora Coin page */}
        <Route path="/zora" element={
          <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-700 flex items-center justify-center">
              <div className="text-purple-200 text-2xl font-mono animate-pulse">
                Loading Zora Coin Data...
              </div>
            </div>
          }>
            <ZoraCoinPage />
          </Suspense>
        } />

        {/* Legacy apps - lazy loaded with providers */}
        <Route path="/legacy/*" element={
          <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-green-400 text-2xl font-mono animate-pulse">
                Loading legacy app...
              </div>
            </div>
          }>
            <LegacyProviders>
              <Routes>
                <Route path="/" element={<LegacyApps />} />
                <Route path="/terminal" element={<TerminalApp />} />
                <Route path="/v0-0-1" element={<V001EpicLaunch />} />
                <Route path="/landing" element={<NewApp />} />
                <Route path="/defi" element={<DeFiTerminal />} />
              </Routes>
            </LegacyProviders>
          </Suspense>
        } />
      </Routes>
    </Router>
  )
}

export default App