import { useEffect, useRef } from 'react'

const Matrix = ({ intensity = 0.8, speed = 1, className = "" }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Matrix characters - mix of Japanese, symbols, and koHLabs themed
    const chars = '$koHLabs⚗️🧪🔬DNA⚛️0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ田由甲申甴电甶男甸甹町画甼甽甾甿畀畁畂畃畄畅畆畇畈畉畊畋界畍畎畏畐畑'
    
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)
    
    // Array to keep track of drops
    const drops = new Array(columns).fill(0).map(() => ({
      y: Math.random() * canvas.height,
      speed: Math.random() * speed + 0.5,
      char: chars[Math.floor(Math.random() * chars.length)],
      brightness: Math.random()
    }))

    const draw = () => {
      // Black background with slight transparency for trail effect
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 * intensity})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px 'JetBrains Mono', 'Fira Code', monospace`
      
      // Draw each character
      drops.forEach((drop, i) => {
        // Green color with varying brightness
        const brightness = Math.floor(drop.brightness * 255)
        ctx.fillStyle = `rgb(0, ${brightness}, ${Math.floor(brightness * 0.5)})`
        
        // Draw character
        ctx.fillText(drop.char, i * fontSize, drop.y)
        
        // Move drop down
        drop.y += drop.speed * fontSize * speed
        
        // Reset drop if it goes off screen or randomly
        if (drop.y > canvas.height || Math.random() < 0.01) {
          drop.y = 0
          drop.char = chars[Math.floor(Math.random() * chars.length)]
          drop.brightness = Math.random()
          drop.speed = Math.random() * speed + 0.5
        }
        
        // Occasionally change character
        if (Math.random() < 0.02) {
          drop.char = chars[Math.floor(Math.random() * chars.length)]
        }
      })
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
  }, [intensity, speed])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'black' }}
    />
  )
}

export default Matrix