import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import EthosPage from './pages/EthosPage'

// Lazy load legacy components for better performance
const KoHLabsExact = lazy(() => import('./KoHLabsExact'))
const KoHLabsOperations = lazy(() => import('./KoHLabsOperations'))
const LiveStreams = lazy(() => import('./LiveStreams'))

const LegacyFallback = (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-green-400 text-2xl font-mono animate-pulse">
      Loading...
    </div>
  </div>
)

function AppClean() {
  return (
    <ErrorBoundary>
      <Router>
      <Routes>
        {/* New koH Ethos page — main landing */}
        <Route path="/" element={<EthosPage />} />

        {/* Legacy routes — previous site */}
        <Route path="/legacy" element={
          <Suspense fallback={LegacyFallback}>
            <KoHLabsExact />
          </Suspense>
        } />
        <Route path="/legacy/operations" element={
          <Suspense fallback={LegacyFallback}>
            <KoHLabsOperations />
          </Suspense>
        } />
        <Route path="/legacy/live" element={
          <Suspense fallback={LegacyFallback}>
            <LiveStreams />
          </Suspense>
        } />

        {/* Fallback to ethos page */}
        <Route path="*" element={<EthosPage />} />
      </Routes>
    </Router>
    </ErrorBoundary>
  )
}

export default AppClean
