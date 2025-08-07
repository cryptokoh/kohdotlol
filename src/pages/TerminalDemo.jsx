import { useState } from 'react'
import {
  TerminalWindow,
  CommandPrompt,
  TerminalInput,
  LabButton,
  ChemicalLoader,
  DNALoader,
  ChemicalError,
  ASCIIArt,
  StatusBar,
  DangerModal,
  MatrixRain
} from '../components/TerminalUI'
import '../styles/terminal.css'

export default function TerminalDemo() {
  const [output, setOutput] = useState([])
  const [loading, setLoading] = useState(false)
  const [showDanger, setShowDanger] = useState(false)
  const [matrixIntensity, setMatrixIntensity] = useState('normal')
  const [terminalVariant, setTerminalVariant] = useState('standard')
  
  const handleCommand = (command) => {
    const timestamp = new Date().toLocaleTimeString()
    setOutput(prev => [...prev, { type: 'command', text: command, timestamp }])
    
    // Simulate command processing
    setLoading(true)
    setTimeout(() => {
      processCommand(command)
      setLoading(false)
    }, 1000)
  }
  
  const processCommand = (command) => {
    const timestamp = new Date().toLocaleTimeString()
    
    switch(command.toLowerCase()) {
      case 'help':
        setOutput(prev => [...prev, {
          type: 'info',
          text: `Available Commands:
  help      - Show this help message
  status    - Display system status
  clear     - Clear terminal
  matrix    - Toggle matrix intensity
  danger    - Activate dangerous mode
  molecule  - Display molecule structure
  dna       - Show DNA helix
  quantum   - Enter quantum state
  error     - Trigger error state`,
          timestamp
        }])
        break
        
      case 'status':
        setOutput(prev => [...prev, {
          type: 'success',
          text: 'System Status: OPTIMAL\nQuantum Coherence: 98.7%\nLab Temperature: 20.3°C',
          timestamp
        }])
        break
        
      case 'clear':
        setOutput([])
        break
        
      case 'matrix':
        const intensities = ['low', 'normal', 'high']
        const currentIndex = intensities.indexOf(matrixIntensity)
        const newIntensity = intensities[(currentIndex + 1) % 3]
        setMatrixIntensity(newIntensity)
        setOutput(prev => [...prev, {
          type: 'info',
          text: `Matrix intensity set to: ${newIntensity.toUpperCase()}`,
          timestamp
        }])
        break
        
      case 'danger':
        setShowDanger(true)
        break
        
      case 'molecule':
        setOutput(prev => [...prev, {
          type: 'ascii',
          art: 'molecule',
          timestamp
        }])
        break
        
      case 'dna':
        setOutput(prev => [...prev, {
          type: 'ascii',
          art: 'dna',
          timestamp
        }])
        break
        
      case 'quantum':
        setTerminalVariant('danger')
        setOutput(prev => [...prev, {
          type: 'warning',
          text: '⚠️ ENTERING QUANTUM STATE - REALITY MAY FLUCTUATE',
          timestamp
        }])
        break
        
      case 'error':
        setOutput(prev => [...prev, {
          type: 'error',
          text: 'CRITICAL ERROR: Containment breach detected in Lab Section 7',
          timestamp
        }])
        break
        
      default:
        setOutput(prev => [...prev, {
          type: 'error',
          text: `Command not found: ${command}`,
          timestamp
        }])
    }
  }
  
  const handleDangerConfirm = () => {
    setShowDanger(false)
    setTerminalVariant('danger')
    setOutput(prev => [...prev, {
      type: 'warning',
      text: '☣️ DANGEROUS MODE ACTIVATED - PROCEED WITH EXTREME CAUTION',
      timestamp: new Date().toLocaleTimeString()
    }])
  }
  
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain intensity={matrixIntensity} />
      
      {/* Particle Effects */}
      <div className="particle-container">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 p-8">
        {/* ASCII Welcome Art */}
        <div className="flex justify-center mb-8">
          <ASCIIArt type="welcome" />
        </div>
        
        {/* Terminal Grid Layout */}
        <div className="terminal-grid terminal-grid-sidebar">
          {/* Sidebar Controls */}
          <div className="space-y-4">
            <TerminalWindow title="CONTROL_PANEL">
              <h3 className="text-cyan-400 mb-4">System Controls</h3>
              
              <div className="space-y-3">
                <LabButton 
                  variant="standard" 
                  onClick={() => handleCommand('status')}
                >
                  Check Status
                </LabButton>
                
                <LabButton 
                  variant="experiment" 
                  onClick={() => handleCommand('molecule')}
                >
                  Run Experiment
                </LabButton>
                
                <LabButton 
                  variant="quantum" 
                  onClick={() => handleCommand('quantum')}
                >
                  Quantum Mode
                </LabButton>
                
                <LabButton 
                  variant="danger" 
                  onClick={() => setShowDanger(true)}
                >
                  Dangerous Mode
                </LabButton>
              </div>
              
              <div className="mt-6">
                <h4 className="text-green-400 mb-2">Lab Indicators</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span>Reactor: STABLE</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Quantum: COHERENT</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                    <span>Synthesis: ACTIVE</span>
                  </div>
                </div>
              </div>
              
              {/* Loading States Demo */}
              <div className="mt-6">
                <h4 className="text-green-400 mb-2">Processes</h4>
                <ChemicalLoader />
                <DNALoader />
              </div>
            </TerminalWindow>
          </div>
          
          {/* Main Terminal */}
          <div className="space-y-4">
            <TerminalWindow 
              title={terminalVariant === 'danger' ? "lab@koH:~# [DANGER]" : "lab@koH:~$"}
              variant={terminalVariant}
            >
              {/* Terminal Output */}
              <div className="space-y-2 mb-4">
                {output.map((line, index) => (
                  <div key={index} className="command-line">
                    {line.type === 'command' && (
                      <div className="flex items-start gap-2">
                        <CommandPrompt type={terminalVariant === 'danger' ? 'root' : 'standard'} />
                        <span className="text-green-400">{line.text}</span>
                        <span className="text-green-400/50 ml-auto text-xs">{line.timestamp}</span>
                      </div>
                    )}
                    {line.type === 'info' && (
                      <pre className="text-cyan-400 pl-4">{line.text}</pre>
                    )}
                    {line.type === 'success' && (
                      <pre className="text-green-400 pl-4">{line.text}</pre>
                    )}
                    {line.type === 'warning' && (
                      <pre className="text-amber-400 pl-4">{line.text}</pre>
                    )}
                    {line.type === 'error' && (
                      <pre className="text-red-400 pl-4">{line.text}</pre>
                    )}
                    {line.type === 'ascii' && (
                      <div className="pl-4">
                        <ASCIIArt type={line.art} />
                      </div>
                    )}
                  </div>
                ))}
                
                {loading && (
                  <div className="flex items-center gap-2 text-purple-400">
                    <span className="animate-spin">⚗️</span>
                    <span>Processing chemical reaction...</span>
                  </div>
                )}
              </div>
              
              {/* Terminal Input */}
              <TerminalInput 
                onSubmit={handleCommand}
                placeholder="Enter command... (type 'help' for commands)"
              />
            </TerminalWindow>
            
            {/* Error State Demo */}
            {output.some(o => o.type === 'error') && (
              <ChemicalError 
                message="Molecular structure unstable. Please recalibrate quantum field generators."
              />
            )}
            
            {/* Status Bar */}
            <StatusBar 
              systemStatus={terminalVariant === 'danger' ? 'DANGER' : 'OPTIMAL'}
              experiments={42}
              temperature={20.3}
            />
          </div>
        </div>
        
        {/* Additional Demo Sections */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Command Prompt Variations */}
          <TerminalWindow title="PROMPT_STYLES">
            <div className="space-y-2">
              <CommandPrompt type="standard" />
              <CommandPrompt type="root" />
              <CommandPrompt type="molecule" />
              <CommandPrompt type="quantum" />
              <CommandPrompt type="neural" />
              <div className="mt-4">
                <CommandPrompt type="standard" processing={true} />
                <CommandPrompt type="standard" success={true} />
                <CommandPrompt type="standard" error={true} />
              </div>
            </div>
          </TerminalWindow>
          
          {/* ASCII Art Gallery */}
          <TerminalWindow title="LAB_STRUCTURES">
            <div className="space-y-4">
              <ASCIIArt type="molecule" />
              <ASCIIArt type="dna" />
              <ASCIIArt type="atom" />
            </div>
          </TerminalWindow>
          
          {/* Button States */}
          <TerminalWindow title="CONTROLS">
            <div className="space-y-3">
              <LabButton variant="standard">Standard</LabButton>
              <LabButton variant="danger">Danger</LabButton>
              <LabButton variant="experiment">Experiment</LabButton>
              <LabButton variant="quantum">Quantum</LabButton>
              <LabButton loading={true}>Loading</LabButton>
              <LabButton disabled={true}>Disabled</LabButton>
            </div>
          </TerminalWindow>
        </div>
      </div>
      
      {/* Danger Modal */}
      <DangerModal
        isOpen={showDanger}
        onConfirm={handleDangerConfirm}
        onCancel={() => setShowDanger(false)}
        message="Activating dangerous mode will enable experimental features that may destabilize the quantum field. 
                 Molecular coherence cannot be guaranteed. Do you wish to proceed?"
      />
    </div>
  )
}