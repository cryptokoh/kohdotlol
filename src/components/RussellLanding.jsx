import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

function WireframeIntro() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const width = mount.clientWidth
    const height = mount.clientHeight

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x07080a, 6, 20)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 1.2, 7)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const group = new THREE.Group()
    scene.add(group)

    const geometry = new THREE.TorusKnotGeometry(1.18, 0.34, 220, 28)
    const material = new THREE.MeshBasicMaterial({
      color: 0xd9b988,
      wireframe: true,
      transparent: true,
      opacity: 0.96,
    })
    const knot = new THREE.Mesh(geometry, material)
    group.add(knot)

    const halo = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 24, 24),
      new THREE.MeshBasicMaterial({
        color: 0x7f9cff,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      })
    )
    group.add(halo)

    const spokeMaterial = new THREE.MeshBasicMaterial({
      color: 0xf0e3c9,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    })

    for (let i = 0; i < 4; i += 1) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.08, 4.5, 0.08), spokeMaterial)
      spoke.rotation.z = (Math.PI / 4) * i
      group.add(spoke)
    }

    let frame = 0
    const animate = () => {
      frame += 1
      group.rotation.y += 0.01
      group.rotation.x = Math.sin(frame * 0.01) * 0.15
      knot.rotation.z += 0.008
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }

    let raf = requestAnimationFrame(animate)

    const onResize = () => {
      const nextWidth = mount.clientWidth
      const nextHeight = mount.clientHeight
      camera.aspect = nextWidth / nextHeight
      camera.updateProjectionMatrix()
      renderer.setSize(nextWidth, nextHeight)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      geometry.dispose()
      material.dispose()
      spokeMaterial.dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="russell-wireframe-canvas" aria-hidden="true" />
}

export default function RussellLanding() {
  const [ready, setReady] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const videoRef = useRef(null)

  const resumeUrl = '/russell-herod-resume.md'
  const videoUrl = '/videos/russell-herod-resume.mp4'

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1100)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    const handleCanPlay = () => {
      setVideoReady(true)
      video.play().catch(() => {})
    }

    const handleError = () => {
      setVideoReady(true)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadeddata', handleCanPlay)
    video.addEventListener('error', handleError)

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadeddata', handleCanPlay)
      video.removeEventListener('error', handleError)
    }
  }, [])

  const statusText = useMemo(() => {
    if (!ready) return 'Initializing wireframe load'
    if (!videoReady) return 'Buffering video'
    return 'Video live'
  }, [ready, videoReady])

  return (
    <main className="russell-page">
      <section className="russell-hero">
        <div className="russell-header">
          <div className="russell-copy">
            <p className="eyebrow mono">Resume / Frameworks / Public Work</p>
            <h1>Russell Herod</h1>
            <p className="lede">
              Hardware support, device repair, e-commerce, blockchain education, community platforms, and public-good infrastructure.
            </p>
          </div>

          <div className="russell-actions">
            <a className="button button--primary mono" href={resumeUrl} download>
              Download Resume MD
            </a>
            <a
              className="button button--secondary mono"
              href="https://www.linkedin.com/in/russell-herod-841372192/"
              target="_blank"
              rel="noreferrer"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div className="russell-media-shell">
          <div className="russell-media-label mono">
            <span>{statusText}</span>
            <span>HyperFrames resume cut</span>
          </div>

          <div className={`russell-loader ${ready ? 'is-hidden' : ''}`} aria-hidden={ready}>
            <WireframeIntro />
            <div className="russell-loader__label">
              <span className="mono">Russell Herod</span>
              <span className="mono russell-loader__status">{statusText}</span>
            </div>
          </div>

          <div className={`russell-media ${ready ? 'is-visible' : ''}`}>
            <video
              ref={videoRef}
              className="russell-video"
              src={videoUrl}
              playsInline
              muted
              loop
              preload="auto"
              autoPlay
              poster="/kohlabs-meme.png"
            />
            <div className="russell-media__veil" />
          </div>
        </div>

        <div className="russell-footer">
          <div>
            <span className="mono note-label">Frameworks</span>
            <p>Harmonik, DANZ / FlowB, Nored Farms, HAND Protocol</p>
          </div>
          <div>
            <span className="mono note-label">Next step</span>
            <p>LinkedIn is the contact path. The resume MD stays downloadable for job sites.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
