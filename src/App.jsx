import { Canvas, useFrame, extend, useThree } from '@react-three/fiber'
import { Sphere, Box, Torus, MeshDistortMaterial, Stars, Float, Trail, Sparkles, Cloud, Environment, Dodecahedron, Tetrahedron, Octahedron, Cone, Cylinder } from '@react-three/drei'
import { motion, useAnimation, useMotionValue, useTransform, useScroll, useSpring } from 'framer-motion'
import { useState, useRef, useEffect, Suspense, useMemo } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing'
import { SolanaTokenActions } from './SolanaTokenActions'

// Ultra Glitch Text Component with 3D Depth
function GlitchText({ children, className }) {
  const [glitched, setGlitched] = useState(false)
  const [ultraGlitch, setUltraGlitch] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitched(true)
      setTimeout(() => setGlitched(false), 200)
    }, 3000)
    
    const ultraInterval = setInterval(() => {
      setUltraGlitch(true)
      setTimeout(() => setUltraGlitch(false), 100)
    }, 7000)
    
    return () => {
      clearInterval(interval)
      clearInterval(ultraInterval)
    }
  }, [])

  return (
    <div className={`relative ${className}`} style={{ transformStyle: 'preserve-3d' }}>
      <span className="relative z-10" style={{ 
        textShadow: '2px 2px 0px rgba(255,0,255,0.5), -2px -2px 0px rgba(0,255,255,0.5)',
        transform: 'translateZ(20px)'
      }}>{children}</span>
      {glitched && (
        <>
          <span className="absolute top-0 left-0.5 text-cyan-400 opacity-80 animate-glitch-1" style={{ transform: 'translateZ(10px)' }}>{children}</span>
          <span className="absolute top-0 -left-0.5 text-pink-400 opacity-80 animate-glitch-2" style={{ transform: 'translateZ(15px)' }}>{children}</span>
          <span className="absolute top-0.5 left-0 text-yellow-400 opacity-60 animate-glitch-1 blur-sm" style={{ transform: 'translateZ(5px)' }}>{children}</span>
          <span className="absolute top-0 left-0 text-green-400 opacity-40 animate-glitch-2 blur-md" style={{ transform: 'translateZ(25px)' }}>{children}</span>
        </>
      )}
      {ultraGlitch && (
        <>
          {[...Array(10)].map((_, i) => (
            <span 
              key={i}
              className="absolute top-0 left-0 animate-shake"
              style={{ 
                color: `hsl(${i * 36}, 100%, 50%)`,
                transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px) translateZ(${i * 3}px)`,
                opacity: 0.5,
                filter: `blur(${i * 0.5}px)`
              }}
            >
              {children}
            </span>
          ))}
        </>
      )}
    </div>
  )
}

// Particle Explosion Component
function ParticleExplosion({ trigger }) {
  const particles = Array(20).fill(null)
  
  return (
    <>
      {trigger && particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full"
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            scale: 0,
            opacity: 0
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ left: '50%', top: '50%' }}
        />
      ))}
    </>
  )
}

// Ultra Holographic Card with Reality Distortion
function HolographicCard({ children, className, delay = 0 }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isUltraMode, setIsUltraMode] = useState(false)
  const cardRef = useRef()
  
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    })
  }
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUltraMode(prev => !prev)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.8, rotateX: -30, rotateY: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotateX: 0, 
        rotateY: 0,
        boxShadow: isUltraMode ? [
          '0 0 100px rgba(255,0,255,0.5)',
          '0 0 200px rgba(0,255,255,0.5)',
          '0 0 100px rgba(255,0,255,0.5)'
        ] : '0 0 50px rgba(255,0,255,0.3)'
      }}
      transition={{ delay, duration: 0.8, type: "spring", stiffness: 100 }}
      whileHover={{ 
        scale: 1.05, 
        z: 100,
        rotateX: mousePos.y / 10 - 5,
        rotateY: mousePos.x / 10 - 5,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
    >
      {/* Multi-layer holographic effects */}
      <div 
        className="absolute inset-0 opacity-60 pointer-events-none rounded-2xl"
        style={{
          background: `
            radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, 
              rgba(255,0,255,0.6) 0%, 
              rgba(0,255,255,0.6) 20%, 
              rgba(255,255,0,0.6) 40%, 
              rgba(0,255,0,0.6) 60%,
              rgba(255,0,0,0.6) 80%,
              transparent 100%)
          `,
          filter: 'blur(30px)',
          transform: `translateZ(20px) scale(${isHovered ? 1.1 : 1})`,
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Prismatic layers */}
      {isHovered && [...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(${i * 72}deg, transparent 40%, rgba(${255 - i * 50},${i * 50},${255},0.1) 50%, transparent 60%)`,
            transform: `translateZ(${10 + i * 5}px) scale(${1 + i * 0.02})`,
            animation: `spin ${3 + i}s linear infinite`
          }}
        />
      ))}
      
      {/* Chrome and glass effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/20 opacity-60 rounded-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/10 to-transparent opacity-40 rounded-2xl pointer-events-none animate-shimmer bg-[length:200%_200%]" />
      
      {/* Ultra RGB border with lightning */}
      <div className="absolute inset-0 rounded-2xl p-[3px]">
        <div className="absolute inset-0 rounded-2xl bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 animate-spin-slow opacity-80" />
        {isHovered && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white via-transparent to-white opacity-50 animate-lightning-strike" />
        )}
      </div>
      
      {/* Main content with extreme backdrop */}
      <div className="relative backdrop-blur-2xl bg-black/70 rounded-2xl border border-white/20 overflow-hidden">
        {/* Reality distortion effect */}
        {isUltraMode && (
          <div className="absolute inset-0 animate-reality-warp">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-transparent to-cyan-600/40 animate-wave-distort" />
            <div className="absolute inset-0 bg-gradient-to-tl from-pink-600/40 via-transparent to-yellow-600/40 animate-wave-distort animation-delay-2000" />
          </div>
        )}
        
        {/* Liquid chrome effect */}
        {isHovered && (
          <>
            <div className="absolute inset-0 opacity-40">
              <div className="absolute inset-0 bg-gradient-conic from-purple-600 via-pink-600 via-cyan-600 via-green-600 via-yellow-600 to-purple-600 animate-liquid" />
            </div>
            <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent opacity-50 animate-pulse" />
          </>
        )}
        
        {/* Multi-particle systems */}
        <ParticleExplosion trigger={isHovered} />
        {isUltraMode && <ParticleExplosion trigger={true} />}
        
        {/* Glitch overlay */}
        {isHovered && (
          <div className="absolute inset-0 opacity-20 animate-cyber-glitch pointer-events-none" />
        )}
        
        {children}
      </div>
    </motion.div>
  )
}

// Matrix Rain Overlay with Enhanced Effects
function MatrixRain() {
  const columns = 50
  const [drops, setDrops] = useState(Array(columns).fill(0).map(() => Math.random() * window.innerHeight))
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDrops(prev => prev.map((drop, i) => {
        if (drop > window.innerHeight && Math.random() > 0.975) {
          return 0
        }
        return drop + Math.random() * 15 + 5
      }))
    }, 33)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {drops.map((drop, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-xs"
          style={{
            left: `${(i / columns) * 100}%`,
            top: drop,
            color: drop < 100 ? '#fff' : '#0f0',
            textShadow: drop < 100 ? '0 0 20px #fff' : '0 0 8px #0f0',
            opacity: Math.max(0, 1 - drop / window.innerHeight)
          }}
          animate={{ opacity: [0.1, 1, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {chars[Math.floor(Math.random() * chars.length)]}
        </motion.div>
      ))}
    </div>
  )
}

// Particle Swarm System
function ParticleSwarm() {
  const count = 500
  const mesh = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      temp.push({
        factor: Math.random() * 100,
        speed: Math.random() * 0.01 + 0.01,
        xFactor: Math.random() * 40 - 20,
        yFactor: Math.random() * 40 - 20,
        zFactor: Math.random() * 40 - 20,
      })
    }
    return temp
  }, [])
  
  useFrame((state) => {
    particles.forEach((particle, i) => {
      const t = state.clock.elapsedTime
      const { factor, speed, xFactor, yFactor, zFactor } = particle
      
      dummy.position.set(
        Math.cos(t * speed + factor) * xFactor,
        Math.sin(t * speed + factor) * yFactor,
        Math.cos(t * speed + factor) * zFactor
      )
      
      dummy.scale.setScalar(Math.sin(t * speed) * 0.5 + 1)
      dummy.rotation.set(t * speed, t * speed, t * speed)
      dummy.updateMatrix()
      
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })
  
  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshPhongMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={0.5} />
    </instancedMesh>
  )
}

// Geometric Chaos with Post Processing
function GeometricChaos() {
  const groupRef = useRef()
  const { viewport } = useThree()
  
  const shapes = useMemo(() => [
    { Component: Dodecahedron, args: [0.5], position: [-2, 0, 0], color: '#ff006e' },
    { Component: Tetrahedron, args: [0.7], position: [0, 0, 0], color: '#00f5ff' },
    { Component: Octahedron, args: [0.6], position: [2, 0, 0], color: '#ffb700' },
    { Component: Cone, args: [0.5, 1, 8], position: [-1, 2, 0], color: '#ff00ff' },
    { Component: Cylinder, args: [0.3, 0.3, 1, 16], position: [1, -2, 0], color: '#00ff00' },
  ], [])
  
  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.5
      groupRef.current.rotation.y = t * 0.2
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.3
    }
  })
  
  return (
    <>
      <EffectComposer>
        <Bloom 
          intensity={2} 
          luminanceThreshold={0.1} 
          luminanceSmoothing={0.9} 
        />
        <ChromaticAberration 
          offset={new THREE.Vector2(0.002, 0.002)}
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={0.5} />
      </EffectComposer>
      
      <group ref={groupRef}>
        <ParticleSwarm />
        
        {shapes.map(({ Component, args, position, color }, i) => (
          <Float key={i} speed={2 + i} rotationIntensity={2} floatIntensity={2}>
            <Component args={args} position={position}>
              <meshPhysicalMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
                clearcoatRoughness={0}
                iridescence={1}
                iridescenceIOR={2.333}
                iridescenceThicknessRange={[100, 1000]}
                transmission={0.5}
                thickness={0.5}
                envMapIntensity={2}
              />
            </Component>
          </Float>
        ))}
      </group>
      
      <Stars radius={100} depth={50} count={20000} factor={4} saturation={0} fade speed={2} />
      <Sparkles count={1000} scale={viewport.width} size={3} speed={0.5} opacity={0.5} color="#fff" />
    </>
  )
}

// Ultra Neon Button with Quantum Effects
function NeonButton({ children, onClick, className, href, ...props }) {
  const [isClicked, setIsClicked] = useState(false)
  const [quantumState, setQuantumState] = useState(0)
  const buttonRef = useRef()
  
  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumState(prev => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  
  const handleClick = (e) => {
    setIsClicked(true)
    
    // Create explosion effect
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) {
      const ripples = 5
      for (let i = 0; i < ripples; i++) {
        setTimeout(() => {
          const ripple = document.createElement('div')
          ripple.className = 'absolute pointer-events-none'
          ripple.style.left = '50%'
          ripple.style.top = '50%'
          ripple.style.width = '10px'
          ripple.style.height = '10px'
          ripple.style.borderRadius = '50%'
          ripple.style.background = ['#ff006e', '#00f5ff', '#ffb700', '#ff00ff', '#00ff00'][i]
          ripple.style.transform = 'translate(-50%, -50%)'
          ripple.style.animation = `explode ${1 + i * 0.1}s ease-out forwards`
          buttonRef.current?.appendChild(ripple)
          setTimeout(() => ripple.remove(), 1500)
        }, i * 50)
      }
    }
    
    setTimeout(() => setIsClicked(false), 600)
    if (onClick) onClick(e)
  }

  const content = (
    <>
      <span className="relative z-10" style={{
        textShadow: quantumState === 0 ? '0 0 10px currentColor' :
                    quantumState === 1 ? '2px 2px 0 #ff006e, -2px -2px 0 #00f5ff' :
                    quantumState === 2 ? '0 0 20px currentColor, 0 0 40px currentColor' :
                    '1px 1px 0 #ff0, -1px -1px 0 #f0f'
      }}>{children}</span>
      
      {/* Multi-layer neon glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 blur-md" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 blur-xl animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-green-600 blur-2xl animate-pulse animation-delay-2000" />
      </div>
      
      {/* Quantum state indicator */}
      <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 rounded-lg animate-spin-slow blur-sm" />
      </div>
      
      {/* Electric arcs */}
      {isClicked && [...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            clipPath: [
              'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)',
              `polygon(0% ${50 - i * 10}%, 100% ${50 + i * 10}%, 100% ${50 + i * 10}%, 0% ${50 - i * 10}%)`,
              'polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)'
            ]
          }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
          style={{
            background: `linear-gradient(90deg, transparent, ${['#ff006e', '#00f5ff', '#ffb700'][i]}, transparent)`,
            filter: 'blur(1px)'
          }}
        />
      ))}
      
      {/* Holographic overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer bg-[length:200%_100%]" />
      </div>
    </>
  )

  const baseClasses = `group relative ${className} transform transition-all duration-300 hover:scale-110 hover:rotate-1 active:scale-95 active:rotate-0 overflow-visible`

  if (href) {
    return (
      <a ref={buttonRef} href={href} className={baseClasses} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button ref={buttonRef} onClick={handleClick} className={baseClasses} {...props}>
      {content}
    </button>
  )
}

// Laser Grid Background
function LaserGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 animate-laser-scan">
        <div className="h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      </div>
      <div className="absolute inset-0 animate-laser-scan animation-delay-2000">
        <div className="w-0.5 h-full bg-gradient-to-b from-transparent via-pink-500 to-transparent" />
      </div>
    </div>
  )
}

// Holographic Scanlines
function HologramScanlines() {
  return (
    <div className="fixed inset-0 pointer-events-none z-30 mix-blend-screen">
      <div className="absolute inset-0 animate-hologram-scan">
        <div className="h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
      }} />
    </div>
  )
}

// Ultra Digital Noise with ASCII Rain
function DigitalNoise() {
  const [noise, setNoise] = useState('')
  const [asciiRain, setAsciiRain] = useState([])
  
  useEffect(() => {
    const interval = setInterval(() => {
      const chars = '█▓▒░╳╱╲│─┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬01'
      const size = 200
      let result = ''
      for (let i = 0; i < size; i++) {
        result += chars[Math.floor(Math.random() * chars.length)]
      }
      setNoise(result)
    }, 50)
    
    const rainInterval = setInterval(() => {
      setAsciiRain(prev => {
        const newRain = [...prev]
        if (Math.random() > 0.8) {
          newRain.push({
            id: Date.now(),
            x: Math.random() * 100,
            char: '▓▒░'[Math.floor(Math.random() * 3)],
            speed: Math.random() * 2 + 1
          })
        }
        return newRain.filter(drop => drop.y === undefined || drop.y < 110)
          .map(drop => ({ ...drop, y: (drop.y || -5) + drop.speed }))
      })
    }, 50)
    
    return () => {
      clearInterval(interval)
      clearInterval(rainInterval)
    }
  }, [])
  
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-20 opacity-[0.03] mix-blend-screen overflow-hidden">
        <div className="font-mono text-xs leading-none whitespace-pre-wrap break-all text-white animate-digital-dissolve">
          {noise}
        </div>
      </div>
      <div className="fixed inset-0 pointer-events-none z-20 opacity-20 mix-blend-screen">
        {asciiRain.map(drop => (
          <div
            key={drop.id}
            className="absolute font-mono text-2xl text-cyan-300"
            style={{
              left: `${drop.x}%`,
              top: `${drop.y}%`,
              textShadow: '0 0 10px currentColor',
              filter: `blur(${drop.speed / 3}px)`
            }}
          >
            {drop.char}
          </div>
        ))}
      </div>
    </>
  )
}

// Ultra Energy Field with Plasma Bursts
function EnergyField() {
  const [plasmaBursts, setPlasmaBursts] = useState([])
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setPlasmaBursts(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 300 + 100,
          color: ['purple', 'cyan', 'pink', 'yellow'][Math.floor(Math.random() * 4)]
        }])
      }
    }, 1000)
    
    const cleanup = setInterval(() => {
      setPlasmaBursts(prev => prev.filter(burst => Date.now() - burst.id < 3000))
    }, 100)
    
    return () => {
      clearInterval(interval)
      clearInterval(cleanup)
    }
  }, [])
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Plasma Bursts */}
      {plasmaBursts.map(burst => (
        <motion.div
          key={burst.id}
          className="absolute"
          style={{ left: `${burst.x}%`, top: `${burst.y}%` }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: [0, 0.3, 0] }}
          transition={{ duration: 3 }}
        >
          <div 
            className={`bg-gradient-radial from-${burst.color}-500 to-transparent blur-3xl`}
            style={{ width: burst.size, height: burst.size }}
          />
        </motion.div>
      ))}
      
      {/* Static Energy Fields */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] animate-energy-surge">
          <div className="absolute inset-0 bg-gradient-radial from-purple-500/30 via-pink-500/20 to-transparent blur-3xl animate-morph" />
          <div className="absolute inset-0 bg-gradient-radial from-cyan-500/30 via-blue-500/20 to-transparent blur-3xl animate-morph animation-delay-2000" />
          <div className="absolute inset-0 bg-gradient-conic from-yellow-500 via-orange-500 to-yellow-500 opacity-10 blur-2xl animate-vortex-spin" />
        </div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] animate-plasma-flow">
          <div className="absolute inset-0 bg-gradient-conic from-pink-500 via-purple-500 to-pink-500 opacity-20 blur-3xl animate-vortex-spin" />
          <div className="absolute inset-0 bg-gradient-radial from-green-500/20 to-transparent blur-3xl animate-quantum-flux" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="absolute inset-0 bg-gradient-conic from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 opacity-10 blur-3xl animate-vortex-spin" />
        </div>
      </div>
    </div>
  )
}

// Audio Visualizer Bars
function AudioVisualizer() {
  const bars = 32
  const [heights, setHeights] = useState(Array(bars).fill(0))
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(Array(bars).fill(0).map(() => Math.random() * 100))
    }, 100)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-40 flex items-end justify-center gap-1 px-4">
      {heights.map((height, i) => (
        <motion.div
          key={i}
          className="relative w-full max-w-[20px]"
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: `linear-gradient(to top, 
              hsl(${(i / bars) * 360}, 100%, 50%) 0%, 
              hsl(${(i / bars) * 360 + 60}, 100%, 70%) 100%)`,
            boxShadow: `0 0 20px hsl(${(i / bars) * 360}, 100%, 50%)`,
            filter: 'blur(0.5px)'
          }}
        />
      ))}
    </div>
  )
}

// Floating Code Rain
function CodeRain() {
  const codeSnippets = [
    'const reality = null;',
    'if (quantum) { collapse(); }',
    'function transcend() {}',
    'await universe.expand();',
    'matrix.glitch(true);',
    'reality.bend(Infinity);',
    'console.log("KOHLABS");',
    'blockchain.revolutionize();',
    'future.create();',
    'dimension.shift(4);'
  ]
  
  const [floatingCode, setFloatingCode] = useState([])
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setFloatingCode(prev => [...prev, {
          id: Date.now(),
          text: codeSnippets[Math.floor(Math.random() * codeSnippets.length)],
          x: Math.random() * 100,
          duration: Math.random() * 10 + 10
        }])
      }
    }, 2000)
    
    const cleanup = setInterval(() => {
      setFloatingCode(prev => prev.filter(code => Date.now() - code.id < 20000))
    }, 1000)
    
    return () => {
      clearInterval(interval)
      clearInterval(cleanup)
    }
  }, [])
  
  return (
    <div className="fixed inset-0 pointer-events-none z-25">
      {floatingCode.map(code => (
        <motion.div
          key={code.id}
          className="absolute font-mono text-xs text-green-400 whitespace-nowrap"
          style={{ left: `${code.x}%` }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: window.innerHeight + 20, opacity: [0, 1, 1, 0] }}
          transition={{ duration: code.duration, ease: "linear" }}
        >
          <span style={{ 
            textShadow: '0 0 10px currentColor',
            transform: `rotate(${Math.random() * 20 - 10}deg)`
          }}>
            {code.text}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function App() {
  const [copied, setCopied] = useState(false)
  const ca = "ELehFFYywLvfxCNVgxesCecYPtk4KcM2RYpor6H3AasN"
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const handleMouseMove = (e) => {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }
  
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(ca)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen w-screen text-white overflow-x-hidden relative" onMouseMove={handleMouseMove}>
      {/* Animated Purple Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-black">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/50 via-violet-900/30 to-transparent animate-gradient-shift" />
        <div className="absolute inset-0 bg-gradient-to-bl from-indigo-950/40 via-purple-900/20 to-transparent animate-gradient-shift animation-delay-4000" />
      </div>
      {/* Layered Visual Effects */}
      <LaserGrid />
      <DigitalNoise />
      <HologramScanlines />
      <MatrixRain />
      <EnergyField />
      <CodeRain />
      <AudioVisualizer />
      
      {/* Mouse-following orb */}
      <motion.div
        className="fixed w-64 h-64 pointer-events-none z-50 mix-blend-screen"
        style={{
          x: useTransform(mouseX, (value) => value - 128),
          y: useTransform(mouseY, (value) => value - 128),
        }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent blur-xl animate-pulse" />
      </motion.div>
      
      {/* Animated gradient orbs with extreme effects */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 left-0 w-[600px] h-[600px] animate-morph"
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -50, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
        >
          <div className="w-full h-full bg-gradient-radial from-purple-600 via-violet-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-plasma-flow" />
        </motion.div>
        <motion.div 
          className="absolute bottom-0 right-0 w-[600px] h-[600px] animate-morph"
          animate={{ 
            x: [0, -100, 50, 0],
            y: [0, 50, -100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
        >
          <div className="w-full h-full bg-gradient-radial from-indigo-500 via-purple-500 to-transparent rounded-full mix-blend-screen filter blur-3xl opacity-40 animate-quantum-flux" />
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]">
          <div className="w-full h-full bg-gradient-conic from-purple-500 via-pink-500 to-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-vortex-spin" />
        </div>
      </div>

      {/* Multi-layer animated grid background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20 animate-grid-move" style={{
          backgroundImage: `
            linear-gradient(rgba(255,0,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
        <div className="absolute inset-0 opacity-10 animate-grid-move" style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,0,0.1) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
          animationDirection: 'reverse',
          animationDuration: '15s'
        }} />
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Reality-Breaking 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
          <fog attach="fog" args={['#1a0033', 5, 20]} />
          <ambientLight intensity={0.05} />
          
          {/* Dynamic Lighting System */}
          <pointLight position={[10, 10, 10]} intensity={3} color="#ff006e" />
          <pointLight position={[-10, -10, 10]} intensity={3} color="#00f5ff" />
          <pointLight position={[0, 0, 5]} intensity={2} color="#ffb700" />
          <pointLight position={[0, 10, 0]} intensity={2.5} color="#ff00ff" />
          <pointLight position={[0, -10, 0]} intensity={2.5} color="#00ffff" />
          <pointLight position={[15, 0, 0]} intensity={2} color="#00ff00" />
          <pointLight position={[-15, 0, 0]} intensity={2} color="#ff0000" />
          
          <Suspense fallback={null}>
            <GeometricChaos />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      {/* Cyberpunk HUD Overlay */}
      <div className="fixed inset-0 pointer-events-none z-30">
        {/* Corner HUD Elements */}
        <div className="absolute top-4 left-4 text-cyan-400 font-mono text-xs opacity-70">
          <div className="animate-blink">▶ SYSTEM ONLINE</div>
          <div className="mt-1">FPS: {Math.floor(Math.random() * 60 + 60)}</div>
          <div className="mt-1">PING: {Math.floor(Math.random() * 50 + 10)}ms</div>
        </div>
        <div className="absolute top-4 right-4 text-pink-400 font-mono text-xs text-right opacity-70">
          <div className="animate-pulse">◆ QUANTUM FLUX: STABLE</div>
          <div className="mt-1">ENTROPY: {(Math.random() * 100).toFixed(1)}%</div>
          <div className="mt-1 animate-electric-pulse">⚡ POWER: MAX</div>
        </div>
        <div className="absolute bottom-4 left-4 text-green-400 font-mono text-xs opacity-70">
          <div className="animate-data-stream">▼ DATA STREAM ACTIVE</div>
          <div className="mt-1">PACKETS: {Math.floor(Math.random() * 9999)}</div>
        </div>
        <div className="absolute bottom-4 right-4 text-yellow-400 font-mono text-xs text-right opacity-70">
          <div>◉ NODE: KOHLABS-{Math.floor(Math.random() * 999)}</div>
          <div className="mt-1 animate-shimmer">BLOCKCHAIN: SYNCED</div>
        </div>
        
        {/* Crosshair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 opacity-20">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
          <div className="absolute inset-0 border border-cyan-500 rounded-full animate-ping" />
        </div>
      </div>
      
      {/* Main Grid Layout with Extreme Styling */}
      <div className="relative z-10 h-full w-full p-4 grid grid-cols-12 grid-rows-6 gap-3">
        
        {/* Header with Ultra Extreme Effects */}
        <HolographicCard className="col-span-12 row-span-1" delay={0}>
          <div className="relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-gradient bg-300%" />
              <div className="absolute inset-0 animate-cyber-glitch" style={{
                background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
              }} />
            </div>
            
            <div className="relative flex items-center justify-between px-6 py-4">
              <motion.div
                animate={{ 
                  filter: [
                    'hue-rotate(0deg) contrast(1)',
                    'hue-rotate(360deg) contrast(1.5)',
                    'hue-rotate(0deg) contrast(1)'
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity }}
              >
                <GlitchText className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-500 to-cyan-500 animate-gradient bg-300% drop-shadow-[0_0_30px_rgba(255,0,255,0.8)]">
                  $koHLabs
                </GlitchText>
              </motion.div>
              
              <div className="flex gap-6">
                {['Twitter', 'Discord', 'Telegram', 'Docs'].map((item, i) => (
                  <motion.a
                    key={item}
                    href="#"
                    className="relative text-gray-300 hover:text-white transition-all duration-300 text-sm font-black uppercase tracking-widest group"
                    whileHover={{ scale: 1.2, rotate: [-5, 5, -5, 0] }}
                    initial={{ opacity: 0, x: 20, rotateY: 90 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    transition={{ delay: 0.1 * i, type: "spring" }}
                  >
                    <span className="relative z-10 group-hover:animate-chromatic-aberration drop-shadow-[0_0_10px_currentColor]">{item}</span>
                    <motion.span 
                      className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 blur-lg opacity-0 group-hover:animate-neon-pulse"
                      whileHover={{ opacity: 1 }}
                    />
                    <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </HolographicCard>

        {/* Hero Section with Reality-Bending Effects */}
        <HolographicCard className="col-span-6 row-span-3" delay={0.2}>
          <div className="relative h-full overflow-hidden">
            {/* Animated background layers */}
            <div className="absolute inset-0 animate-reality-warp">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-600/20 via-transparent to-cyan-600/20 animate-plasma-flow" />
              <div className="absolute inset-0 animate-grid-move" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='60' height='60' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 60 0 L 0 0 0 60' fill='none' stroke='rgba(255,255,255,0.05)' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)'/%3E%3C/svg%3E")`
              }} />
            </div>
            
            <div className="relative p-6 flex flex-col justify-center h-full">
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.h1 
                  className="text-7xl font-black mb-2 relative"
                  animate={{ 
                    textShadow: [
                      '0 0 20px #ff006e, 0 0 40px #ff006e',
                      '0 0 40px #00f5ff, 0 0 80px #00f5ff',
                      '0 0 20px #ffb700, 0 0 40px #ffb700',
                      '0 0 20px #ff006e, 0 0 40px #ff006e'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="absolute inset-0 blur-sm animate-prism-split">
                    <GlitchText className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-green-500 to-blue-500">
                      KOHLABS
                    </GlitchText>
                  </span>
                  <GlitchText className="relative text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 animate-gradient bg-300% drop-shadow-[0_0_40px_rgba(255,0,255,1)]">
                    KOHLABS
                  </GlitchText>
                </motion.h1>
              </motion.div>
              
              <motion.p 
                className="text-gray-300 mb-6 font-light text-lg"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  letterSpacing: ['0px', '2px', '0px']
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                The future of decentralized finance
              </motion.p>
              
              <div className="flex gap-3">
              <NeonButton
                onClick={copyToClipboard}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg font-bold"
              >
                {copied ? "COPIED!" : "COPY CA"}
              </NeonButton>
              <NeonButton
                href={`https://pump.fun/coin/${ca}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-cyan-500 rounded-lg font-bold hover:bg-cyan-500/20"
              >
                TRADE
              </NeonButton>
            </div>
            
              <motion.div 
                className="mt-4 text-xs font-mono break-all relative group cursor-pointer"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={copyToClipboard}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 animate-shimmer bg-[length:200%_100%]">
                  {ca}
                </span>
              </motion.div>
            </div>
          </div>
        </HolographicCard>

        {/* Stats Grid with RGB Effects */}
        <div className="col-span-6 row-span-2 grid grid-cols-3 gap-3">
          {[
            { label: "MCAP", value: "$8.5M", color: "from-pink-500 to-purple-500", delay: 0.3 },
            { label: "HOLDERS", value: "25K+", color: "from-purple-500 to-blue-500", delay: 0.4 },
            { label: "VOLUME", value: "$5.2M", color: "from-blue-500 to-cyan-500", delay: 0.5 },
            { label: "PRICE", value: "$0.0042", color: "from-cyan-500 to-green-500", delay: 0.6 },
            { label: "SUPPLY", value: "1B", color: "from-green-500 to-yellow-500", delay: 0.7 },
            { label: "ATH", value: "$0.0089", color: "from-yellow-500 to-pink-500", delay: 0.8 }
          ].map((stat) => (
            <HolographicCard key={stat.label} delay={stat.delay}>
              <motion.div 
                className="p-3 text-center relative overflow-hidden group"
                whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated background effect */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    background: [
                      `radial-gradient(circle at 20% 50%, ${stat.color.includes('pink') ? 'rgba(255,0,127,0.3)' : stat.color.includes('purple') ? 'rgba(147,51,234,0.3)' : 'rgba(0,255,255,0.3)'} 0%, transparent 50%)`,
                      `radial-gradient(circle at 80% 50%, ${stat.color.includes('pink') ? 'rgba(255,0,127,0.3)' : stat.color.includes('purple') ? 'rgba(147,51,234,0.3)' : 'rgba(0,255,255,0.3)'} 0%, transparent 50%)`,
                      `radial-gradient(circle at 20% 50%, ${stat.color.includes('pink') ? 'rgba(255,0,127,0.3)' : stat.color.includes('purple') ? 'rgba(147,51,234,0.3)' : 'rgba(0,255,255,0.3)'} 0%, transparent 50%)`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                <motion.h3 
                  className={`relative text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]`}
                  animate={{ 
                    scale: [1, 1.1, 1],
                    filter: [
                      'brightness(1) contrast(1)',
                      'brightness(1.5) contrast(1.2)',
                      'brightness(1) contrast(1)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="animate-electric-pulse">{stat.value}</span>
                </motion.h3>
                <motion.p 
                  className="text-xs text-gray-400 uppercase tracking-[0.3em] mt-1 font-bold"
                  animate={{ letterSpacing: ['0.3em', '0.4em', '0.3em'] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {stat.label}
                </motion.p>
                
                {/* Holographic shimmer on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-hologram-scan" />
                </div>
              </motion.div>
            </HolographicCard>
          ))}
        </div>

        {/* Features with Liquid Metal Effect */}
        <HolographicCard className="col-span-4 row-span-2" delay={0.9}>
          <div className="p-4 h-full">
            <h2 className="text-xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse">
              FEATURES
            </h2>
            <div className="space-y-2 text-sm">
              {[
                { icon: "⚡", text: "Lightning-fast transactions", color: "text-cyan-500" },
                { icon: "🔒", text: "Military-grade security", color: "text-purple-500" },
                { icon: "🌐", text: "Global accessibility", color: "text-pink-500" },
                { icon: "💎", text: "Deflationary tokenomics", color: "text-yellow-500" }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  className="flex items-center gap-2"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  whileHover={{ x: 10 }}
                >
                  <span className={`${feature.color} text-lg animate-bounce`}>{feature.icon}</span>
                  <span className="text-gray-200">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </HolographicCard>

        {/* Tokenomics with Animated Bars */}
        <HolographicCard className="col-span-4 row-span-2" delay={1}>
          <div className="p-4 h-full">
            <h2 className="text-xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              TOKENOMICS
            </h2>
            <div className="space-y-3">
              {[
                { label: "Liquidity", value: "40%", color: "bg-purple-500", delay: 1.1 },
                { label: "Marketing", value: "20%", color: "bg-pink-500", delay: 1.2 },
                { label: "Development", value: "20%", color: "bg-cyan-500", delay: 1.3 },
                { label: "Community", value: "20%", color: "bg-green-500", delay: 1.4 }
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-gray-300 font-bold">{item.value}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: item.value }}
                      transition={{ duration: 1, delay: item.delay }}
                      style={{
                        boxShadow: `0 0 20px ${item.color.replace('bg-', '#')}`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </HolographicCard>

        {/* Call to Action with Extreme Effects */}
        <HolographicCard className="col-span-4 row-span-2" delay={1.5}>
          <motion.div 
            className="p-4 h-full flex flex-col justify-center items-center text-center"
            animate={{ 
              background: [
                'radial-gradient(circle, rgba(34,193,195,0.1) 0%, rgba(253,187,45,0.1) 100%)',
                'radial-gradient(circle, rgba(253,187,45,0.1) 0%, rgba(34,193,195,0.1) 100%)'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.h2 
              className="text-3xl font-black mb-2"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-400 to-orange-400 animate-gradient bg-300%">
                JOIN NOW
              </span>
            </motion.h2>
            <p className="text-sm text-gray-300 mb-3">Be part of the revolution</p>
            <div className="flex gap-2">
              <NeonButton className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-black rounded-lg font-bold text-sm">
                Buy Now
              </NeonButton>
              <NeonButton className="px-4 py-2 border border-cyan-500 rounded-lg font-bold text-sm">
                Chart
              </NeonButton>
            </div>
          </motion.div>
        </HolographicCard>

        {/* Ticker with Ultimate Rainbow Effects */}
        <HolographicCard className="col-span-6 row-span-1" delay={1.6}>
          <div className="relative overflow-hidden">
            {/* Animated laser scan effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute h-full w-1 bg-gradient-to-b from-transparent via-white to-transparent opacity-50 animate-laser-scan" />
            </div>
            
            <div className="flex items-center px-4 py-3 overflow-hidden">
              <div className="flex gap-8 animate-marquee whitespace-nowrap">
                {Array(5).fill(null).map((_, index) => (
                  <div key={index} className="flex gap-8">
                    <motion.span 
                      className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 animate-gradient bg-300% uppercase tracking-wider"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, delay: index * 0.2, repeat: Infinity }}
                    >
                      <span className="animate-lightning-strike">⚡</span> NEW ATH INCOMING
                    </motion.span>
                    <span className="text-sm text-gray-500 animate-blink">•</span>
                    <motion.span 
                      className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient bg-300% uppercase tracking-wider"
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 4, delay: index * 0.3, repeat: Infinity }}
                    >
                      📈 +342% THIS WEEK
                    </motion.span>
                    <span className="text-sm text-gray-500 animate-blink animation-delay-2000">•</span>
                    <motion.span 
                      className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-cyan-500 to-blue-500 animate-gradient bg-300% uppercase tracking-wider"
                      animate={{ 
                        filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)']
                      }}
                      transition={{ duration: 3, delay: index * 0.4, repeat: Infinity }}
                    >
                      🔥 TRENDING #1 EVERYWHERE
                    </motion.span>
                    <span className="text-sm text-gray-500 animate-blink animation-delay-4000">•</span>
                    <motion.span 
                      className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-purple-500 animate-gradient bg-300% uppercase tracking-wider"
                      animate={{ 
                        textShadow: [
                          '0 0 10px rgba(255,0,255,0.5)',
                          '0 0 20px rgba(255,0,255,1)',
                          '0 0 10px rgba(255,0,255,0.5)'
                        ]
                      }}
                      transition={{ duration: 1.5, delay: index * 0.5, repeat: Infinity }}
                    >
                      💎 DIAMOND HANDS ONLY
                    </motion.span>
                    <span className="text-sm text-gray-500">•</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </HolographicCard>
      </div>
      
      {/* Solana Token Actions Section */}
      <section className="relative z-20 py-20 px-4 bg-gradient-to-b from-transparent via-purple-950/50 to-black/80">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="relative"
        >
          {/* Section separator with glow effect */}
          <div className="absolute -top-20 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
          <div className="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-b from-purple-500/20 to-transparent blur-xl" />
          
          <SolanaTokenActions tokenAddress={ca} />
        </motion.div>
      </section>
    </div>
  )
}

export default App