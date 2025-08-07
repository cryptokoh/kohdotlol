import { createContext, useContext, useState, useEffect } from 'react'

const ViewContext = createContext()

export const useView = () => {
  const context = useContext(ViewContext)
  if (!context) {
    throw new Error('useView must be used within a ViewProvider')
  }
  return context
}

export const ViewProvider = ({ children }) => {
  const [isMobileView, setIsMobileView] = useState(false)
  const [isActualMobile, setIsActualMobile] = useState(false)

  // Detect if user is on actual mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsActualMobile(isMobile)
      // Auto-enable mobile view on actual mobile devices
      if (isMobile) {
        setIsMobileView(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load view preference from localStorage
  useEffect(() => {
    const savedView = localStorage.getItem('kohlabs-mobile-view')
    if (savedView !== null && !isActualMobile) {
      setIsMobileView(JSON.parse(savedView))
    }
  }, [isActualMobile])

  const toggleView = () => {
    const newView = !isMobileView
    setIsMobileView(newView)
    if (!isActualMobile) {
      localStorage.setItem('kohlabs-mobile-view', JSON.stringify(newView))
    }
  }

  const value = {
    isMobileView,
    isActualMobile,
    toggleView,
    viewMode: isMobileView ? 'mobile' : 'desktop'
  }

  return (
    <ViewContext.Provider value={value}>
      {children}
    </ViewContext.Provider>
  )
}