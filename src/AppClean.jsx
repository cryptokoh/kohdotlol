import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load all major components for better performance
const KoHLabsExact = lazy(() => import('./KoHLabsExact'))
const KoHLabsOperations = lazy(() => import('./KoHLabsOperations'))
const LiveStreams = lazy(() => import('./LiveStreams'))

// Super clean app - just the essential pages, no wallet dependencies
function AppClean() {
  return (
    <ErrorBoundary>
      <Router>
      <Routes>
        {/* Main KoHLabs landing page */}
        <Route path="/" element={
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
        
        {/* Live Streams Status Page */}
        <Route path="/live" element={
          <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-green-400 text-2xl font-mono animate-pulse">
                Loading Live Streams...
              </div>
            </div>
          }>
            <LiveStreams />
          </Suspense>
        } />
        
        {/* Fallback for any other route */}
        <Route path="*" element={
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
      </Routes>
    </Router>
    </ErrorBoundary>
  )
}

export default AppClean