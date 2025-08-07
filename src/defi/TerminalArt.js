// ASCII Art Collection for koHLabs Terminal
export const ASCII_ART = {
  kohlabs_logo: `
    ██╗  ██╗ ██████╗ ██╗  ██╗██╗      █████╗ ██████╗ ███████╗
    ██║ ██╔╝██╔═══██╗██║  ██║██║     ██╔══██╗██╔══██╗██╔════╝
    █████╔╝ ██║   ██║███████║██║     ███████║██████╔╝███████╗
    ██╔═██╗ ██║   ██║██╔══██║██║     ██╔══██║██╔══██╗╚════██║
    ██║  ██╗╚██████╔╝██║  ██║███████╗██║  ██║██████╔╝███████║
    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝`,

  dna_helix: `
         🧬 DNA SEQUENCING COMPLETE 🧬
           A═══T     G═══C
          ╱     ╲   ╱     ╲
         T       A═C       G
          ╲     ╱   ╲     ╱
           G═══C     A═══T
          ╱     ╲   ╱     ╲
         C       G═T       A
          ╲     ╱   ╲     ╱
           A═══T     G═══C`,

  beaker_success: `
              🧪 EXPERIMENT SUCCESS 🧪
                     ∩───∩
                    │ ░░░ │  ← Success Bubbles
                    │ ♦♦♦ │  ← Diamond Compound
                    │ ███ │  ← Rocket Fuel
                    └─────┘
                   🔥 IGNITION 🔥`,

  molecule_structure: `
          🔬 MOLECULAR STRUCTURE ANALYSIS 🔬
               
                    H
                    │
            H───C───C───H    ← Prosperity Chain
                │   │
                H   OH       ← Moon Catalyst
                    
        Formula: C₂H₆O (Ethereum + Hodl + Oxygen)`,

  rocket_launch: `
               🚀 LAUNCHING TO THE MOON 🚀
                        ╱│╲
                       ╱ │ ╲
                      ╱  │  ╲
                     ╱───┴───╲
                    │ KOHLABS │
                    │  ████   │
                    │  ████   │
                    └─────────┘
                   🔥🔥🔥🔥🔥🔥🔥
                 💎💎💎💎💎💎💎💎💎`,

  periodic_table: `
         🧪 KOHLABS PERIODIC TABLE OF DEFI 🧪
    ┌──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┐
    │H │  │  │  │  │  │  │  │  │  │  │He│  ← Noble Holders
    │1 │  │  │  │  │  │  │  │  │  │  │2 │
    ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤
    │Li│Be│  │  │  │  │  │  │  │  │  │  │
    │3 │4 │  │  │  │  │  │  │  │  │  │  │
    ├──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┼──┤
    │  │  │  │  │Ko│H │  │  │  │  │  │  │  ← KOHLABS
    │  │  │  │  │42│1 │  │  │  │  │  │  │
    └──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┴──┘`,

  success_celebration: `
        🎉 TRANSACTION SUCCESSFUL 🎉
           ╔═══════════════════════╗
           ║  💎 DIAMOND HANDS 💎  ║
           ║     ╔═══════════╗     ║
           ║     ║ SUCCESS!! ║     ║
           ║     ╚═══════════╝     ║
           ║  🚀 TO THE MOON 🚀   ║
           ╚═══════════════════════╝
              ⭐⭐⭐⭐⭐⭐⭐`,

  lab_equipment: `
       ⚗️ KOHLABS EQUIPMENT STATUS ⚗️
      
      🧪 Beakers: ████████ 100% Ready
      🔬 Microscope: ████████ Analyzing
      ⚡ Generator: ████████ Full Power  
      💎 Diamond Press: ████████ Active
      🚀 Launch Pad: ████████ Prepared
      📡 Blockchain Link: ████████ Synced`,

  warning_sign: `
         ⚠️ LABORATORY SAFETY WARNING ⚠️
         ╔═══════════════════════════════╗
         ║  🧤 WEAR PROTECTIVE GLOVES    ║
         ║  🥽 SAFETY GOGGLES REQUIRED   ║
         ║  🔥 HIGHLY VOLATILE TOKENS    ║
         ║  💎 DIAMOND HANDS ONLY       ║
         ║  🚨 FOMO LEVELS CRITICAL     ║
         ╚═══════════════════════════════╝`,

  loading_dna: `
         🧬 DNA SEQUENCE LOADING 🧬
           
           A-T-G-C-${['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'][Math.floor(Math.random()*10)]}-A-T-G-C
           | | | |   | | | |
           T-A-C-G-${['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏'][Math.floor(Math.random()*10)]}-T-A-C-G
           
         Genetic Algorithm: ${Math.floor(Math.random()*100)}%`
}

// Fun command responses
export const MAD_SCIENTIST_RESPONSES = {
  success: [
    "🧪 EUREKA! The experiment was a complete success!",
    "⚡ BREAKTHROUGH! Molecular bonds formed perfectly!",
    "🔬 HYPOTHESIS CONFIRMED! Results exceeded expectations!",
    "💎 CRYSTALLIZATION COMPLETE! Diamond structure achieved!",
    "🚀 IGNITION SEQUENCE SUCCESSFUL! We have liftoff!"
  ],
  
  error: [
    "💥 CHEMICAL REACTION FAILED! Adjusting molecular formula...",
    "⚠️ EXPERIMENT UNSTABLE! Initiating safety protocols...",
    "🧪 MIXTURE REJECTED! Incompatible compounds detected...",
    "🔥 COMBUSTION ERROR! Cooling chambers activated...",
    "⚡ CIRCUIT OVERLOAD! Rerouting power through backup systems..."
  ],
  
  processing: [
    "🧬 Sequencing genetic code...",
    "⚗️ Mixing volatile compounds...",
    "🔬 Analyzing molecular structure...", 
    "💎 Crystallizing diamond lattice...",
    "🚀 Calculating orbital trajectory..."
  ]
}

// Random lab facts that appear during idle time
export const LAB_FACTS = [
  "💡 Did you know? The koH chemical formula creates perfectly stable diamond hands!",
  "🧬 Fun fact: DeFi protocols have 42% more molecular stability than traditional finance!",
  "⚗️ Laboratory note: Mixing HODL with WAGMI creates an explosive moon compound!",
  "🔬 Scientific discovery: Paper hands evaporate at exactly 69°C under FUD pressure!",
  "💎 Research shows: Diamond hands have a crystalline structure identical to actual diamonds!",
  "🚀 Physics fact: Moon missions require exactly 1.21 gigawatts of diamond hand energy!",
  "🧪 Chemistry lesson: The molecular weight of FOMO is inversely related to portfolio size!"
]

// Easter egg ASCII animations
export const ASCII_ANIMATIONS = {
  matrix_kohlabs: () => {
    const frames = [
      "█ █ █ koH █ █ █",
      "█ █ koH Labs █ █", 
      "█ koHLabs DeFi █",
      "koHLabs Terminal",
      "█ koHLabs DeFi █",
      "█ █ koH Labs █ █",
      "█ █ █ koH █ █ █"
    ]
    return frames[Math.floor(Math.random() * frames.length)]
  },
  
  dancing_molecules: () => {
    const molecules = ["⚛️", "🧬", "⚗️", "🔬", "💎", "⚡"]
    return molecules.map(m => 
      Math.random() > 0.5 ? m : `<${m}>`
    ).join(" ")
  },
  
  bubbling_beaker: () => {
    const bubbles = ["○", "◯", "●", "◐", "◑", "◒", "◓"]
    const bubble = bubbles[Math.floor(Math.random() * bubbles.length)]
    return `🧪${bubble}${bubble}${bubble} *BUBBLE BUBBLE*`
  }
}

// Sound effect text representations
export const SOUND_EFFECTS = {
  success: ["*DING!*", "*CHIME!*", "*SPARKLE!*"],
  error: ["*BZZT!*", "*FIZZLE*", "*POP!*"],  
  processing: ["*WHIRR*", "*HUM*", "*BUZZ*"],
  explosion: ["*BOOM!*", "*BANG!*", "*KAPOW!*"]
}

export default { ASCII_ART, MAD_SCIENTIST_RESPONSES, LAB_FACTS, ASCII_ANIMATIONS, SOUND_EFFECTS }