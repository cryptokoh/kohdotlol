import { useEffect, useRef } from 'react'
import { useTheme } from '../contexts/ThemeContext'

const SimpleMatrix = ({ intensity = 0.4, className = "" }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const { theme } = useTheme()
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Simple Matrix characters
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$koHLabs⚗️🧪⚛️'
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    
    const drops = []
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height
    }

    const draw = () => {
      // Semi-transparent black background for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Get theme color
      const color = theme.css?.['--theme-primary'] || '#00ff41'
      ctx.fillStyle = color
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`
      
      // Add subtle glow
      ctx.shadowColor = color
      ctx.shadowBlur = 8

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        
        // Vary brightness for depth
        const brightness = Math.random() * 0.5 + 0.5
        ctx.globalAlpha = brightness * intensity
        
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        // Reset drop occasionally or when it goes off screen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
      
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
    }

    const animate = () => {
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [intensity, theme])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ 
        background: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
        opacity: 0.6
      }}
    />
  )
}

export default SimpleMatrix