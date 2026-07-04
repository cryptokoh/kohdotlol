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
          <div className="russell-contact mono">
            <span className="note-label">Contact</span>
            <a
              href="https://www.linkedin.com/in/russell-herod-841372192/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div className="russell-media-shell">
          <div className="russell-media-label mono">
            <span>{statusText}</span>
            <span>HyperFrames presentation cut</span>
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
              poster="/videos/russell-herod-resume-poster.jpg"
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
            <p>Resume MD remains available at the page root for job-site submission.</p>
          </div>
        </div>
      </section>

      <section className="russell-section">
        <div className="russell-section__header">
          <p className="eyebrow mono">Selected Experience</p>
          <h2>Work that led to the frameworks</h2>
        </div>
        <div className="russell-experience">
          <article>
            <span className="mono note-label">2019 to 2024</span>
            <h3>KohX LLC, Ballwin, MO</h3>
            <p>
              Founded Kindness of Humanity Exchange around proof-of-stake blockchain ideas for charities and impact
              organizations. Spoke at tech conferences and worked with Blockchain Center Miami on education for
              mining and cybersecurity basics.
            </p>
          </article>
          <article>
            <span className="mono note-label">2009 to 2018</span>
            <h3>RA Resources, Arlington, TX</h3>
            <p>
              Ran device repair and troubleshooting work focused on Android hardware, then broadened the business
              into general electronics support and technical help.
            </p>
          </article>
          <article>
            <span className="mono note-label">2008 to 2009</span>
            <h3>Desktop Disposal, LLC</h3>
            <p>
              Managed sales, inventory, warehouse flow, and refurbished equipment resale through e-commerce
              channels.
            </p>
          </article>
          <article>
            <span className="mono note-label">2002 to 2007</span>
            <h3>Pinnacle Solutions</h3>
            <p>
              Handled tech support, file work, customer service, and sales support while building early systems
              thinking around business and operations.
            </p>
          </article>
        </div>
      </section>

      <section className="russell-section russell-section--split">
        <div>
          <p className="eyebrow mono">Technical Foundation</p>
          <h2>Support, systems, and shipping habits</h2>
        </div>
        <div className="russell-prose">
          <p>
            Built web hosting at 15, worked with cPanel, Plesk, Service Desk Plus, and IRC-era support flows, and
            stayed fluent across Windows, Adobe tools, networking, hardware repair, and Linux.
          </p>
          <p>
            The resume is intentionally written to show range without losing the through line: community systems,
            commerce systems, and public-facing infrastructure.
          </p>
        </div>
      </section>
    </main>
  )
}
