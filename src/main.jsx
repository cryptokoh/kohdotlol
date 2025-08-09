import { createRoot } from 'react-dom/client'
import './index.css'
// Use clean app without wallet dependencies for now
import App from './AppClean.jsx'

// Debugging removed for production

// Wait for DOM to be ready
function mountApp() {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    // Root element not found - fail silently in production
    return
  }
  
  // Mounting React app to root element
  try {
    // Remove StrictMode to avoid double initialization issues
    createRoot(rootElement).render(<App />)
    // React app mounted successfully
  } catch (error) {
    // Error mounting React app - show fallback UI
    // Fallback UI on error
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <h1 style="font-size: 3rem; margin: 0;">$koHLabs</h1>
        <p style="font-size: 1.2rem; margin-top: 1rem;">Loading error - please refresh</p>
        <button onclick="location.reload()" style="
          margin-top: 2rem;
          padding: 10px 20px;
          font-size: 1rem;
          background: white;
          color: #764ba2;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        ">Refresh Page</button>
      </div>
    `
  }
}

// Mount app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp)
} else {
  mountApp()
}
