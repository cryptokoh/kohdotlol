import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import ResumePage from './ResumePage'

const KoHLabsExact = lazy(() => import('./KoHLabsExact'))
const KoHLabsOperations = lazy(() => import('./KoHLabsOperations'))
const LiveStreams = lazy(() => import('./LiveStreams'))

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<ResumePage />}
          />
          <Route
            path="/labs"
            element={
              <Suspense fallback={null}>
                <KoHLabsExact />
              </Suspense>
            }
          />
          <Route
            path="/operations"
            element={
              <Suspense fallback={null}>
                <KoHLabsOperations />
              </Suspense>
            }
          />
          <Route
            path="/live"
            element={
              <Suspense fallback={null}>
                <LiveStreams />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={<ResumePage />}
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  )
}

export default App
