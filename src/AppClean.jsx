import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import KoHLabsExact from './KoHLabsExact'

// Lazy load operations page
const KoHLabsOperations = lazy(() => import('./KoHLabsOperations'))

// Super clean app - just the essential pages, no wallet dependencies
function AppClean() {
  return (
    <Router>
      <Routes>
        {/* Main KoHLabs landing page */}
        <Route path="/" element={<KoHLabsExact />} />
        
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
        
        {/* Fallback for any other route */}
        <Route path="*" element={<KoHLabsExact />} />
      </Routes>
    </Router>
  )
}

export default AppClean