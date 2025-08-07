export const themes = {
  matrix: {
    name: 'Matrix',
    icon: '🟢',
    description: 'Classic green Matrix aesthetic',
    colors: {
      primary: '#00ff41',
      secondary: '#008f11',
      accent: '#00ff41',
      background: 'bg-black',
      terminal: 'bg-gray-900',
      text: 'text-green-400',
      textSecondary: 'text-green-300',
      textMuted: 'text-green-600',
      border: 'border-green-400',
      glow: 'shadow-green-400/50'
    },
    css: {
      '--theme-primary': '#00ff41',
      '--theme-secondary': '#008f11',
      '--theme-accent': '#00ff41',
      '--theme-glow': '#00ff4180'
    }
  },

  cyberpunk: {
    name: 'Cyberpunk',
    icon: '🟣',
    description: 'Neon purple cyberpunk vibes',
    colors: {
      primary: '#ff00ff',
      secondary: '#8b00ff',
      accent: '#00ffff',
      background: 'bg-purple-950',
      terminal: 'bg-gray-900',
      text: 'text-purple-400',
      textSecondary: 'text-cyan-400',
      textMuted: 'text-purple-600',
      border: 'border-purple-400',
      glow: 'shadow-purple-400/50'
    },
    css: {
      '--theme-primary': '#ff00ff',
      '--theme-secondary': '#8b00ff',
      '--theme-accent': '#00ffff',
      '--theme-glow': '#ff00ff80'
    }
  },

  hacker: {
    name: 'Hacker',
    icon: '🔴',
    description: 'Red terminal hacker mode',
    colors: {
      primary: '#ff0000',
      secondary: '#cc0000',
      accent: '#ff4444',
      background: 'bg-red-950',
      terminal: 'bg-gray-900',
      text: 'text-red-400',
      textSecondary: 'text-red-300',
      textMuted: 'text-red-600',
      border: 'border-red-400',
      glow: 'shadow-red-400/50'
    },
    css: {
      '--theme-primary': '#ff0000',
      '--theme-secondary': '#cc0000',
      '--theme-accent': '#ff4444',
      '--theme-glow': '#ff000080'
    }
  },

  neon: {
    name: 'Neon',
    icon: '🟡',
    description: 'Electric yellow neon aesthetics',
    colors: {
      primary: '#ffff00',
      secondary: '#ffcc00',
      accent: '#ffffff',
      background: 'bg-yellow-950',
      terminal: 'bg-gray-900',
      text: 'text-yellow-400',
      textSecondary: 'text-white',
      textMuted: 'text-yellow-600',
      border: 'border-yellow-400',
      glow: 'shadow-yellow-400/50'
    },
    css: {
      '--theme-primary': '#ffff00',
      '--theme-secondary': '#ffcc00',
      '--theme-accent': '#ffffff',
      '--theme-glow': '#ffff0080'
    }
  },

  ice: {
    name: 'Ice',
    icon: '🔵',
    description: 'Cool blue ice terminal',
    colors: {
      primary: '#00aaff',
      secondary: '#0088cc',
      accent: '#00ffff',
      background: 'bg-blue-950',
      terminal: 'bg-gray-900',
      text: 'text-blue-400',
      textSecondary: 'text-cyan-400',
      textMuted: 'text-blue-600',
      border: 'border-blue-400',
      glow: 'shadow-blue-400/50'
    },
    css: {
      '--theme-primary': '#00aaff',
      '--theme-secondary': '#0088cc',
      '--theme-accent': '#00ffff',
      '--theme-glow': '#00aaff80'
    }
  }
}

export const defaultTheme = 'matrix'