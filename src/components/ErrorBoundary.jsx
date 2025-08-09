import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    // For now, we'll just silently handle it
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center px-8">
            <h1 className="text-4xl font-bold text-green-400 mb-4">Oops! Something went wrong</h1>
            <p className="text-gray-400 mb-8">The matrix has encountered an error. Please refresh to continue.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary