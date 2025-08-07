import { createContext, useContext, useState, useEffect } from 'react'
import { themes, defaultTheme } from '../config/themes'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme)

  // Apply theme CSS variables to document
  useEffect(() => {
    const theme = themes[currentTheme]
    if (theme && theme.css) {
      Object.entries(theme.css).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value)
      })
    }
  }, [currentTheme])

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('kohlabs-terminal-theme')
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName)
      localStorage.setItem('kohlabs-terminal-theme', themeName)
      return true
    }
    return false
  }

  const getTheme = () => themes[currentTheme]

  const listThemes = () => {
    return Object.entries(themes).map(([key, theme]) => ({
      key,
      name: theme.name,
      icon: theme.icon,
      description: theme.description,
      active: key === currentTheme
    }))
  }

  const value = {
    currentTheme,
    theme: getTheme(),
    changeTheme,
    listThemes,
    themes
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}