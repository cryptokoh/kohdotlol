import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ErrorBoundary from './components/ErrorBoundary'

const ResumePage = lazy(() => import('./ResumePage'))
const KoHLabsExact = lazy(() => import('./KoHLabsExact'))
const KoHLabsOperations = lazy(() => import('./KoHLabsOperations'))
const LiveStreams = lazy(() => import('./LiveStreams'))

function LoadingState({ label }) {
  return (
    <div className="min-h-screen bg-[#08090b] flex items-center justify-center">
      <div className="text-[#d9b988] text-sm font-mono tracking-[0.3em] uppercase animate-pulse">
        {label}
      </div>
    </div>
  )
}

function AppClean() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<LoadingState label="Loading Russell Herod..." />}>
                <ResumePage />
              </Suspense>
            }
          />
          <Route
            path="/labs"
            element={
              <Suspense fallback={<LoadingState label="Loading KoHLabs..." />}>
                <KoHLabsExact />
              </Suspense>
            }
          />
          <Route
            path="/operations"
            element={
              <Suspense fallback={<LoadingState label="Loading KoHLabs Operations..." />}>
                <KoHLabsOperations />
              </Suspense>
            }
          />
          <Route
            path="/live"
            element={
              <Suspense fallback={<LoadingState label="Loading Live Streams..." />}>
                <LiveStreams />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingState label="Loading Russell Herod..." />}>
                <ResumePage />
              </Suspense>
            }
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default AppClean
