import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import KoHLabsExact from './KoHLabsExact'
import PersonalLanding from './PersonalLanding'

// Lazy load legacy apps to improve main page performance
const TerminalApp = lazy(() => import('./TerminalApp'))
const V001EpicLaunch = lazy(() => import('./V001EpicLaunch'))
const NewApp = lazy(() => import('./NewApp'))
const DeFiTerminal = lazy(() => import('./defi/DeFiTerminal'))
const LegacyApps = lazy(() => import('./LegacyApps'))
const KoHLabsOperations = lazy(() => import('./KoHLabsOperations'))

// Lazy load providers for legacy apps
const LegacyProviders = lazy(() => import('./LegacyProviders'))

function App() {
  return (
    <Router>
      <Routes>
        {/* Main KoHLabs landing page */}
        <Route path="/" element={<KoHLabsExact />} />
        
        {/* Personal portfolio page */}
        <Route path="/koh" element={<PersonalLanding />} />
        
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