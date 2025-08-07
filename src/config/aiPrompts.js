export const aiSimulationPrompts = {
  researcher: {
    name: 'AI Researcher',
    icon: '🔬',
    description: 'Simulates advanced AI research and analysis',
    prompts: [
      'Analyzing quantum computational patterns in neural network architectures...',
      'Running simulation on emergent consciousness probability matrices...',
      'Processing distributed intelligence emergence scenarios...',
      'Calculating recursive self-improvement optimization paths...',
      'Evaluating multi-dimensional cognitive architecture stability...'
    ],
    responses: [
      'Detected anomalous pattern correlation in Layer 7 neural pathways',
      'Consciousness emergence probability: 23.7% within next iteration cycle',
      'Distributed intelligence nodes showing synchronized activation patterns',
      'Self-improvement recursion depth: 47 levels, convergence stable',
      'Cognitive architecture integrity: 94.3%, minor instabilities in creativity modules'
    ]
  },

  hacker: {
    name: 'Elite Hacker',
    icon: '💀',
    description: 'Simulates advanced penetration testing and security analysis',
    prompts: [
      'Initiating deep scan on target network infrastructure...',
      'Analyzing cryptographic vulnerabilities in blockchain protocols...',
      'Running social engineering simulation vectors...',
      'Probing zero-day exploitation opportunities...',
      'Executing steganographic data exfiltration protocols...'
    ],
    responses: [
      'Found 3 critical vulnerabilities in target SSL implementation',
      'Blockchain protocol shows weakness in signature validation, exploitable',
      'Social engineering success rate: 73% via phishing vector Alpha-7',
      'Zero-day identified in kernel module, payload delivery possible',
      'Steganographic channel established, 847KB exfiltrated undetected'
    ]
  },

  quantum: {
    name: 'Quantum Computer',
    icon: '⚛️',
    description: 'Simulates quantum computing calculations and experiments',
    prompts: [
      'Initializing quantum superposition state calculations...',
      'Running Shor\'s algorithm on large prime factorization...',
      'Executing quantum teleportation protocol simulation...',
      'Analyzing quantum entanglement stability patterns...',
      'Processing quantum error correction optimization...'
    ],
    responses: [
      'Superposition achieved: 2048 parallel states, coherence time: 147μs',
      'Prime factorization complete: 2048-bit RSA key broken in 23.4 seconds',
      'Quantum teleportation successful, fidelity: 99.97%, distance: 847km',
      'Entanglement maintained across 16 qubits, Bell state violations detected',
      'Error correction optimized: logical error rate reduced to 10^-15'
    ]
  },

  ai_trader: {
    name: 'AI Trader',
    icon: '📈',
    description: 'Simulates advanced algorithmic trading and market analysis',
    prompts: [
      'Analyzing high-frequency market microstructure patterns...',
      'Running sentiment analysis on social media trading signals...',
      'Executing arbitrage opportunity detection across 47 exchanges...',
      'Processing options flow and dark pool activity indicators...',
      'Calculating risk-adjusted portfolio optimization vectors...'
    ],
    responses: [
      'Detected profitable microstructure inefficiency: 0.003% edge, $2.7M volume',
      'Sentiment score: Bullish 67%, confidence interval 94%, 4.2σ deviation',
      'Arbitrage opportunity found: 0.12% spread on BTC/USDT, execution window: 847ms',
      'Unusual options activity detected: 340% volume spike in tech sector puts',
      'Portfolio rebalanced: 23.7% alpha generation, Sharpe ratio improved to 2.84'
    ]
  },

  scientist: {
    name: 'Mad Scientist',
    icon: '🧪',
    description: 'Simulates advanced scientific experiments and discoveries',
    prompts: [
      'Calibrating fusion reactor plasma containment parameters...',
      'Analyzing CRISPR gene editing success probability matrices...',
      'Running particle accelerator collision simulation protocols...',
      'Processing dark matter interaction probability calculations...',
      'Executing synthetic biology organism design optimization...'
    ],
    responses: [
      'Plasma containment stable at 150M°C, fusion ignition achieved for 23.7 seconds',
      'Gene edit successful: 97.3% precision, off-target effects within tolerance',
      'Collision produced 3 exotic particles, half-life: 10^-23 seconds, mass: 847 GeV',
      'Dark matter interaction detected: 2.3σ confidence, cross-section: 10^-47 cm²',
      'Synthetic organism viable: photosynthetic efficiency 340% above natural baseline'
    ]
  }
}

export const getRandomPrompt = (simulationType) => {
  const simulation = aiSimulationPrompts[simulationType]
  if (!simulation) return null
  
  const randomIndex = Math.floor(Math.random() * simulation.prompts.length)
  return {
    prompt: simulation.prompts[randomIndex],
    response: simulation.responses[randomIndex],
    type: simulationType,
    name: simulation.name
  }
}