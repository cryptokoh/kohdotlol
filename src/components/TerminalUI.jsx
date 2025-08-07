import { useState, useEffect, useRef } from 'react'

// Terminal Window Component with Glass Morphism
export function TerminalWindow({ children, title = "lab@koH:~$", variant = "standard" }) {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  
  return (
    <div className={`
      terminal-window relative
      ${isMaximized ? 'fixed inset-4 z-50' : ''}
      ${isMinimized ? 'hidden' : ''}
      ${variant === 'danger' ? 'terminal-danger' : ''}
      bg-black/85 backdrop-blur-xl
      border border-green-400/20
      rounded-xl
      shadow-[0_20px_40px_rgba(0,255,65,0.1)]
      hover:shadow-[0_25px_50px_rgba(0,255,65,0.15)]
      transition-all duration-300
    `}>
      {/* Terminal Header */}
      <div className="terminal-header bg-gradient-to-r from-green-400/10 to-cyan-400/10 
                      border-b border-green-400/20 px-4 py-3 flex items-center gap-3">
        {/* Terminal Controls */}
        <div className="flex gap-1.5">
          <button 
            onClick={() => setIsMinimized(true)}
            className="w-3 h-3 rounded-full bg-red-500 border border-red-600 
                       hover:brightness-125 transition-all duration-200"
          />
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600 
                       hover:brightness-125 transition-all duration-200"
          />
          <button 
            onClick={() => setIsMaximized(!isMaximized)}
            className="w-3 h-3 rounded-full bg-green-500 border border-green-600 
                       hover:brightness-125 transition-all duration-200"
          />
        </div>
        
        {/* Terminal Title */}
        <div className="text-green-400 font-mono text-sm flex-1">{title}</div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 text-xs font-mono">QUANTUM_READY</span>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </div>
      </div>
      
      {/* Terminal Body */}
      <div className="terminal-body p-5 font-mono text-sm text-green-400 min-h-[400px] overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

// Command Prompt Component
export function CommandPrompt({ 
  type = "standard", 
  processing = false, 
  error = false,
  success = false 
}) {
  const prompts = {
    standard: "lab@koH:~$ ",
    root: "lab@koH:~# ",
    molecule: "molecule://synthesis> ",
    quantum: "quantum@lab//> ",
    neural: "neural.network::> "
  }
  
  const getPromptColor = () => {
    if (error) return "text-red-400"
    if (success) return "text-green-400"
    if (processing) return "text-purple-400"
    if (type === "root") return "text-magenta-400"
    if (type === "molecule") return "text-lime-400"
    if (type === "quantum") return "text-pink-400"
    if (type === "neural") return "text-cyan-400"
    return "text-cyan-400"
  }
  
  return (
    <div className={`flex items-center gap-2 ${getPromptColor()}`}>
      <span className="prompt">{prompts[type]}</span>
      {processing && <span className="animate-spin">⚗️</span>}
      {success && <span>✓</span>}
      {error && <span>✗</span>}
    </div>
  )
}

// Terminal Input Component
export function TerminalInput({ onSubmit, placeholder = "Enter command..." }) {
  const [value, setValue] = useState("")
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef(null)
  
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) {
      setHistory([...history, value])
      onSubmit(value)
      setValue("")
      setHistoryIndex(-1)
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' && historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setValue(history[history.length - 1 - newIndex])
    } else if (e.key === 'ArrowDown' && historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setValue(history[history.length - 1 - newIndex])
    } else if (e.key === 'ArrowDown' && historyIndex === 0) {
      setHistoryIndex(-1)
      setValue("")
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <CommandPrompt />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-green-400/5 border border-green-400/30 
                   text-green-400 px-2 py-1 rounded
                   placeholder-green-400/30 outline-none
                   focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(0,255,255,0.3)]
                   hover:bg-green-400/10 hover:border-green-400/50
                   transition-all duration-200"
      />
      <Cursor />
    </form>
  )
}

// Animated Cursor Component
export function Cursor() {
  return (
    <span className="inline-block w-2.5 h-5 bg-green-400 animate-pulse" 
          style={{ animation: 'blink-cursor 1s infinite' }} />
  )
}

// Lab Button Component
export function LabButton({ 
  children, 
  variant = "standard", 
  onClick, 
  disabled = false,
  loading = false 
}) {
  const variants = {
    standard: "border-green-400 text-green-400 hover:bg-green-400/20",
    danger: "border-magenta-400 text-magenta-400 hover:bg-magenta-400/20",
    experiment: "border-lime-400 text-lime-400 hover:bg-lime-400/20 animate-pulse",
    quantum: "border-pink-400 text-pink-400 hover:bg-pink-400/20",
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden
        px-4 py-2 rounded
        font-mono text-sm
        border transition-all duration-300
        ${variants[variant]}
        ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
        ${loading ? 'animate-pulse' : ''}
        hover:shadow-[0_0_20px_currentColor]
        hover:-translate-y-0.5
        active:translate-y-0
        active:shadow-[inset_0_0_30px_rgba(0,255,65,0.2)]
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⚗️</span>
          Processing...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

// Loading States
export function ChemicalLoader() {
  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <span className="text-3xl animate-bounce" style={{ animationDelay: '0ms' }}>⚗️</span>
      <span className="text-3xl animate-bounce" style={{ animationDelay: '200ms' }}>🧪</span>
      <span className="text-3xl animate-bounce" style={{ animationDelay: '400ms' }}>⚗️</span>
    </div>
  )
}

export function DNALoader() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-2 border-green-400/30 rounded-full animate-ping" />
        <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full animate-ping" 
             style={{ animationDelay: '500ms' }} />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">🧬</div>
      </div>
    </div>
  )
}

// Error States
export function ChemicalError({ message }) {
  return (
    <div className="relative bg-gradient-to-r from-red-500/10 to-amber-500/10 
                    border border-red-400 rounded-lg p-4 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 bg-red-400 text-black 
                      text-xs text-center py-1 animate-pulse">
        ☣️ CONTAMINATION DETECTED ☣️
      </div>
      <div className="mt-6 text-red-400 font-mono">
        <p className="text-sm mb-2">ERROR: Chemical Reaction Failed</p>
        <p className="text-xs opacity-75">{message}</p>
      </div>
    </div>
  )
}

// ASCII Art Display
export function ASCIIArt({ type = "welcome" }) {
  const art = {
    welcome: `
╔══════════════════════════════════════════╗
║     __         __  __   __            __  ║
║    / /  ___   / / / /  / /  ___ ____ / /  ║
║   / _ \\/ _ \\ / _ \\/ /__/ _ \\/ _ / _ / _/  ║
║  /_//_/\\___//_//_/____/_//_/\\_,_/___/___/ ║
║                                           ║
║         LABORATORY TERMINAL v2.0.0        ║
║            [QUANTUM ENHANCED]             ║
╚══════════════════════════════════════════╝`,
    molecule: `
       O
      / \\
     H   H`,
    dna: `
    /\\/\\/\\
   |  ||  |
    \\/\\/\\/`,
    atom: `
      .--.
     /    \\
    | (e-) |
     \\    /
      '--'`
  }
  
  return (
    <pre className="text-green-400 font-mono text-xs leading-tight">
      {art[type]}
    </pre>
  )
}

// Status Bar Component
export function StatusBar({ 
  systemStatus = "OPTIMAL", 
  experiments = 42, 
  temperature = 20.0 
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 
                    bg-green-400/5 border-t border-green-400/20 
                    font-mono text-xs text-green-400/70">
      <div className="flex items-center gap-4">
        <span>System: [{systemStatus}]</span>
        <span>████████████ 100%</span>
      </div>
      <div className="flex items-center gap-4">
        <span>Lab Temp: {temperature}°C ± 0.1</span>
        <span>Experiments: {experiments} [RUNNING]</span>
        <span>|ψ⟩ = α|0⟩ + β|1⟩</span>
      </div>
    </div>
  )
}

// Modal Component for Dangerous Operations
export function DangerModal({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 flex items-center justify-center 
                    bg-black/90 backdrop-blur-lg z-[10000]">
      <div className="bg-black/85 border-2 border-magenta-400 rounded-xl p-8 
                      max-w-lg animate-[modal-appear_0.3s_ease-out]
                      shadow-[0_0_100px_rgba(255,0,255,0.5)]">
        <div className="flex items-center gap-3 text-magenta-400 text-xl mb-4">
          <span className="text-3xl animate-pulse">⚠️</span>
          <span className="font-mono">DANGEROUS OPERATION</span>
        </div>
        
        <p className="text-green-400 font-mono text-sm mb-6">{message}</p>
        
        <div className="flex gap-4">
          <LabButton variant="danger" onClick={onConfirm}>
            PROCEED WITH CAUTION
          </LabButton>
          <LabButton variant="standard" onClick={onCancel}>
            ABORT OPERATION
          </LabButton>
        </div>
      </div>
    </div>
  )
}

// Matrix Rain Background Component
export function MatrixRain({ intensity = "normal" }) {
  const intensityClasses = {
    low: "opacity-30",
    normal: "opacity-50",
    high: "opacity-70 animate-[matrix-intensity_2s_ease-in-out_infinite]"
  }
  
  return (
    <div className={`fixed inset-0 pointer-events-none ${intensityClasses[intensity]}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/20 to-transparent" />
      {/* Matrix rain effect would be implemented here with canvas or CSS animations */}
    </div>
  )
}

// Export all components
export default {
  TerminalWindow,
  CommandPrompt,
  TerminalInput,
  Cursor,
  LabButton,
  ChemicalLoader,
  DNALoader,
  ChemicalError,
  ASCIIArt,
  StatusBar,
  DangerModal,
  MatrixRain
}