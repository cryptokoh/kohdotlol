import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Add error handler for initialization issues
window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('Cannot access')) {
    console.warn('Initialization error detected, attempting recovery...', event)
    // Don't prevent default to see the error in console
  }
})

// Add debugging for production
console.log('main.jsx loaded')

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('Root element not found!')
} else {
  console.log('Mounting React app to root element')
  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
    console.log('React app mounted successfully')
  } catch (error) {
    console.error('Error mounting React app:', error)
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
