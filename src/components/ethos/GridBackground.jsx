import { useEffect, useRef } from 'react'

export default function GridBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationId
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const gridSize = 60
      const offset = (time * 0.15) % gridSize

      // Vertical lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)'
      ctx.lineWidth = 1
      for (let x = offset; x < w; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = offset; y < h; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Subtle intersection dots
      for (let x = offset; x < w; x += gridSize) {
        for (let y = offset; y < h; y += gridSize) {
          const dist = Math.sqrt(
            Math.pow(x - w / 2, 2) + Math.pow(y - h / 2, 2)
          )
          const maxDist = Math.sqrt(Math.pow(w / 2, 2) + Math.pow(h / 2, 2))
          const alpha = 0.06 * (1 - dist / maxDist)

          ctx.fillStyle = `rgba(0, 240, 255, ${alpha})`
          ctx.beginPath()
          ctx.arc(x, y, 1.5, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Horizontal scan line
      const scanY = (time * 0.5) % (h + 200) - 100
      const gradient = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50)
      gradient.addColorStop(0, 'rgba(0, 240, 255, 0)')
      gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.03)')
      gradient.addColorStop(1, 'rgba(0, 240, 255, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, scanY - 50, w, 100)

      time++
      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
