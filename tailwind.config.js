/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        gradient: 'gradient 3s ease infinite',
        pulse: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        blob: 'blob 7s infinite',
        'glitch-1': 'glitch-1 0.5s infinite',
        'glitch-2': 'glitch-2 0.5s infinite',
        blink: 'blink 1s infinite',
        'matrix-rain': 'matrix-rain 20s linear infinite',
        marquee: 'marquee 15s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'rgb-border': 'rgb-border 3s ease-in-out infinite',
        liquid: 'liquid 4s ease-in-out infinite',
        'grid-move': 'grid-move 20s linear infinite',
        shimmer: 'shimmer 3s linear infinite',
        'float-y': 'float-y 6s ease-in-out infinite',
        'float-x': 'float-x 8s ease-in-out infinite',
        morph: 'morph 8s ease-in-out infinite',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
        'electric-pulse': 'electric-pulse 0.3s ease-in-out infinite',
        aurora: 'aurora 10s ease-in-out infinite',
        'cyber-glitch': 'cyber-glitch 2s linear infinite',
        'hologram-scan': 'hologram-scan 4s linear infinite',
        'wave-distort': 'wave-distort 3s ease-in-out infinite',
        'chromatic-aberration': 'chromatic-aberration 4s ease-in-out infinite',
        'data-stream': 'data-stream 1s linear infinite',
        'laser-scan': 'laser-scan 2s linear infinite',
        'plasma-flow': 'plasma-flow 5s ease-in-out infinite',
        'quantum-flux': 'quantum-flux 3s ease-in-out infinite',
        'vortex-spin': 'vortex-spin 10s linear infinite',
        'energy-surge': 'energy-surge 2s ease-in-out infinite',
        'digital-dissolve': 'digital-dissolve 3s ease-in-out infinite',
        'matrix-cascade': 'matrix-cascade 2s linear infinite',
        'prism-split': 'prism-split 3s ease-in-out infinite',
        'void-pulse': 'void-pulse 4s ease-in-out infinite',
        'fractal-zoom': 'fractal-zoom 8s ease-in-out infinite',
        'lightning-strike': 'lightning-strike 0.5s ease-out',
        'reality-warp': 'reality-warp 6s ease-in-out infinite',
        explode: 'explode 1s ease-out forwards',
        'rainbow-text': 'rainbow-text 5s linear infinite',
        'glitch-skew': 'glitch-skew 1s ease-in-out infinite',
        'holo-float': 'holo-float 3s ease-in-out infinite',
        'data-corruption': 'data-corruption 0.5s steps(10) infinite',
        'neon-flicker': 'neon-flicker 2s linear infinite',
        'dimension-shift': 'dimension-shift 4s ease-in-out infinite',
        'chrome-wave': 'chrome-wave 3s linear infinite',
        'quantum-entangle': 'quantum-entangle 2s ease-in-out infinite alternate',
        'plasma-morph': 'plasma-morph 5s ease-in-out infinite',
        'hexagon-spin': 'hexagon-spin 20s linear infinite',
        'strobe-flash': 'strobe-flash 0.1s steps(2) infinite',
        'matrix-glitch': 'matrix-glitch 0.8s steps(20) infinite',
        'infinity-loop': 'infinity-loop 8s linear infinite',
        'color-cycle': 'color-cycle 3s linear infinite',
        'perspective-warp': 'perspective-warp 10s ease-in-out infinite',
        'lightning-flash': 'lightning-flash 4s linear infinite',
        'portal-spin': 'portal-spin 15s linear infinite',
        'data-rain': 'data-rain 1.5s linear infinite',
        'glitch-rgb': 'glitch-rgb 0.1s infinite',
        'reality-tear': 'reality-tear 3s ease-in-out infinite',
        'hyperdrive': 'hyperdrive 2s ease-in-out infinite',
        'cosmic-dust': 'cosmic-dust 20s linear infinite',
        'neural-pulse': 'neural-pulse 1.5s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
        'glitch-1': {
          '0%, 100%': {
            transform: 'translate(0)',
            opacity: '1',
          },
          '20%': {
            transform: 'translate(-1px, 1px)',
            opacity: '0.8',
          },
          '40%': {
            transform: 'translate(-1px, -1px)',
            opacity: '0.8',
          },
          '60%': {
            transform: 'translate(1px, 1px)',
            opacity: '0.8',
          },
          '80%': {
            transform: 'translate(1px, -1px)',
            opacity: '0.8',
          },
        },
        'glitch-2': {
          '0%, 100%': {
            transform: 'translate(0)',
            opacity: '1',
          },
          '20%': {
            transform: 'translate(1px, -1px)',
            opacity: '0.8',
          },
          '40%': {
            transform: 'translate(1px, 1px)',
            opacity: '0.8',
          },
          '60%': {
            transform: 'translate(-1px, -1px)',
            opacity: '0.8',
          },
          '80%': {
            transform: 'translate(-1px, 1px)',
            opacity: '0.8',
          },
        },
        blink: {
          '0%, 50%, 100%': {
            opacity: '1',
          },
          '25%, 75%': {
            opacity: '0',
          },
        },
        'matrix-rain': {
          '0%': {
            transform: 'translateY(-100%)',
          },
          '100%': {
            transform: 'translateY(100%)',
          },
        },
        marquee: {
          '0%': {
            transform: 'translateX(0%)',
          },
          '100%': {
            transform: 'translateX(-100%)',
          },
        },
        'rgb-border': {
          '0%, 100%': {
            borderColor: 'rgb(255, 0, 0)',
          },
          '33%': {
            borderColor: 'rgb(0, 255, 0)',
          },
          '66%': {
            borderColor: 'rgb(0, 0, 255)',
          },
        },
        liquid: {
          '0%, 100%': {
            transform: 'scale(1) rotate(0deg)',
            borderRadius: '33% 67% 70% 30% / 30% 30% 70% 70%',
          },
          '50%': {
            transform: 'scale(1.1) rotate(180deg)',
            borderRadius: '67% 33% 30% 70% / 70% 70% 30% 30%',
          },
        },
        'grid-move': {
          '0%': {
            transform: 'translate(0, 0)',
          },
          '100%': {
            transform: 'translate(50px, 50px)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
        'float-y': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        'float-x': {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '50%': {
            transform: 'translateX(20px)',
          },
        },
        morph: {
          '0%, 100%': {
            borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
          },
          '50%': {
            borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%',
          },
        },
        'neon-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 5px theme(colors.cyan.400), 0 0 20px theme(colors.cyan.400)',
          },
          '50%': {
            boxShadow: '0 0 20px theme(colors.cyan.400), 0 0 40px theme(colors.cyan.400)',
          },
        },
        shake: {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)',
          },
          '20%, 80%': {
            transform: 'translate3d(2px, 0, 0)',
          },
          '30%, 50%, 70%': {
            transform: 'translate3d(-4px, 0, 0)',
          },
          '40%, 60%': {
            transform: 'translate3d(4px, 0, 0)',
          },
        },
        'electric-pulse': {
          '0%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.5',
            transform: 'scale(0.98)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        aurora: {
          '0%, 100%': {
            transform: 'translateX(-50%) translateY(0) rotate(0deg)',
            opacity: '0.5',
          },
          '50%': {
            transform: 'translateX(-50%) translateY(-20px) rotate(180deg)',
            opacity: '1',
          },
        },
        'cyber-glitch': {
          '0%, 100%': {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
          },
          '10%': {
            clipPath: 'polygon(0 0, 100% 0, 100% 95%, 0% 100%)',
          },
          '20%': {
            clipPath: 'polygon(0 5%, 100% 0, 100% 100%, 0% 95%)',
          },
        },
        'hologram-scan': {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0',
          },
          '50%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(100%)',
            opacity: '0',
          },
        },
        'wave-distort': {
          '0%, 100%': {
            transform: 'scaleY(1) skewX(0deg)',
          },
          '50%': {
            transform: 'scaleY(0.9) skewX(2deg)',
          },
        },
        'chromatic-aberration': {
          '0%, 100%': {
            textShadow: '0 0 0 transparent',
          },
          '50%': {
            textShadow: '-2px 0 #ff00ff, 2px 0 #00ffff',
          },
        },
        'data-stream': {
          '0%': {
            transform: 'translateY(0) scaleY(1)',
            opacity: '0',
          },
          '50%': {
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(100vh) scaleY(10)',
            opacity: '0',
          },
        },
        'laser-scan': {
          '0%': {
            transform: 'translateX(-100%) scaleX(0)',
            opacity: '0',
          },
          '50%': {
            transform: 'translateX(0%) scaleX(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateX(100%) scaleX(0)',
            opacity: '0',
          },
        },
        'plasma-flow': {
          '0%, 100%': {
            filter: 'hue-rotate(0deg) saturate(100%)',
            transform: 'scale(1)',
          },
          '50%': {
            filter: 'hue-rotate(180deg) saturate(200%)',
            transform: 'scale(1.1)',
          },
        },
        'quantum-flux': {
          '0%': {
            opacity: '1',
            filter: 'blur(0px)',
          },
          '50%': {
            opacity: '0.3',
            filter: 'blur(4px)',
          },
          '100%': {
            opacity: '1',
            filter: 'blur(0px)',
          },
        },
        'vortex-spin': {
          '0%': {
            transform: 'rotate(0deg) scale(1)',
          },
          '50%': {
            transform: 'rotate(180deg) scale(0.8)',
          },
          '100%': {
            transform: 'rotate(360deg) scale(1)',
          },
        },
        'energy-surge': {
          '0%, 100%': {
            boxShadow: 'inset 0 0 20px rgba(255,255,255,0.5)',
          },
          '50%': {
            boxShadow: 'inset 0 0 60px rgba(255,255,255,1), 0 0 40px rgba(255,255,255,0.8)',
          },
        },
        'digital-dissolve': {
          '0%, 100%': {
            filter: 'brightness(1) contrast(1)',
          },
          '50%': {
            filter: 'brightness(2) contrast(0.5)',
          },
        },
        'matrix-cascade': {
          '0%': {
            transform: 'translateY(-100%) scale(0)',
          },
          '100%': {
            transform: 'translateY(100vh) scale(1)',
          },
        },
        'prism-split': {
          '0%, 100%': {
            filter: 'blur(0) hue-rotate(0deg)',
          },
          '50%': {
            filter: 'blur(2px) hue-rotate(90deg)',
          },
        },
        'void-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            filter: 'brightness(1)',
          },
          '50%': {
            transform: 'scale(0.95)',
            filter: 'brightness(0.5)',
          },
        },
        'fractal-zoom': {
          '0%': {
            transform: 'scale(1) rotate(0deg)',
          },
          '100%': {
            transform: 'scale(1.5) rotate(360deg)',
          },
        },
        'lightning-strike': {
          '0%': {
            opacity: '0',
          },
          '10%': {
            opacity: '1',
          },
          '11%': {
            opacity: '0',
          },
          '20%': {
            opacity: '1',
          },
          '100%': {
            opacity: '0',
          },
        },
        'reality-warp': {
          '0%, 100%': {
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
          },
          '50%': {
            transform: 'perspective(1000px) rotateX(10deg) rotateY(10deg)',
          },
        },
        explode: {
          '0%': {
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: '1',
          },
          '100%': {
            transform: 'translate(-50%, -50%) scale(50)',
            opacity: '0',
          },
        },
        'rainbow-text': {
          '0%, 100%': { color: '#ff0000' },
          '17%': { color: '#ff8800' },
          '33%': { color: '#ffff00' },
          '50%': { color: '#00ff00' },
          '67%': { color: '#0088ff' },
          '83%': { color: '#ff00ff' },
        },
        'glitch-skew': {
          '0%, 100%': { transform: 'skew(0deg, 0deg)' },
          '20%': { transform: 'skew(-4deg, 0deg)' },
          '40%': { transform: 'skew(3deg, 0deg)' },
          '60%': { transform: 'skew(-2deg, 0deg)' },
          '80%': { transform: 'skew(1deg, 0deg)' },
        },
        'holo-float': {
          '0%, 100%': {
            transform: 'translateY(0) rotateX(0) rotateY(0)',
          },
          '33%': {
            transform: 'translateY(-10px) rotateX(5deg) rotateY(5deg)',
          },
          '66%': {
            transform: 'translateY(5px) rotateX(-5deg) rotateY(-5deg)',
          },
        },
        'data-corruption': {
          '0%, 95%': { opacity: '1' },
          '96%, 100%': { opacity: '0' },
        },
        'neon-flicker': {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.3' },
          '94%': { opacity: '1' },
          '95%': { opacity: '0.5' },
        },
        'dimension-shift': {
          '0%, 100%': {
            transform: 'perspective(1000px) rotateY(0deg) translateZ(0)',
          },
          '50%': {
            transform: 'perspective(1000px) rotateY(180deg) translateZ(100px)',
          },
        },
        'chrome-wave': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'quantum-entangle': {
          '0%': {
            transform: 'rotate(0deg) scale(1)',
            filter: 'hue-rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg) scale(1.2)',
            filter: 'hue-rotate(360deg)',
          },
        },
        'plasma-morph': {
          '0%, 100%': {
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            transform: 'rotate(0deg) scale(1)',
          },
          '25%': {
            borderRadius: '58% 42% 75% 25% / 76% 46% 54% 24%',
            transform: 'rotate(90deg) scale(1.1)',
          },
          '50%': {
            borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%',
            transform: 'rotate(180deg) scale(0.9)',
          },
          '75%': {
            borderRadius: '33% 67% 58% 42% / 63% 68% 32% 37%',
            transform: 'rotate(270deg) scale(1.05)',
          },
        },
      },
      animationDelay: {
        '2000': '2000ms',
        '4000': '4000ms',
      },
      backgroundSize: {
        '300%': '300%',
      },
    },
  },
  plugins: [],
}