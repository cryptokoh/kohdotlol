# koH Labs Terminal Interface Design Specification

## Visual Identity Overview

The koH Labs terminal interface combines the professionalism of Claude CLI with cyberpunk laboratory aesthetics, creating an "uber-leet" terminal experience that feels both scientifically rigorous and hackingly exciting.

---

## 1. Color System

### Primary Palette - Laboratory Neon
```css
/* Core Terminal Colors */
--terminal-green: #00FF41;      /* Classic terminal green */
--terminal-cyan: #00FFFF;       /* Cyan accent */
--terminal-amber: #FFAA00;      /* Warning/caution */
--terminal-magenta: #FF00FF;    /* Dangerous mode */

/* Matrix Rain Background */
--matrix-primary: #00FF41;      /* Primary rain color */
--matrix-secondary: #00CC33;    /* Secondary rain */
--matrix-fade: #003300;         /* Fading characters */
--matrix-glow: #00FF4180;       /* Glow effect */

/* Laboratory Accents */
--lab-acid: #AAFF00;           /* Chemical acid green */
--lab-plasma: #FF00AA;         /* Plasma pink */
--lab-radiation: #FFFF00;      /* Radiation yellow */
--lab-cryo: #00AAFF;          /* Cryogenic blue */
--lab-toxic: #AA00FF;         /* Toxic purple */

/* Glass Morphism */
--glass-bg: rgba(0, 10, 5, 0.85);          /* Dark glass background */
--glass-border: rgba(0, 255, 65, 0.2);     /* Subtle green border */
--glass-shadow: rgba(0, 255, 65, 0.1);     /* Soft glow shadow */
--glass-blur: blur(12px);                   /* Background blur amount */

/* System States */
--state-success: #00FF88;      /* Success green */
--state-error: #FF0044;        /* Error red */
--state-warning: #FFAA00;      /* Warning amber */
--state-info: #00AAFF;         /* Info blue */
--state-processing: #AA00FF;   /* Processing purple */
```

### Gradient Definitions
```css
/* Terminal Gradients */
--gradient-terminal: linear-gradient(135deg, #00FF41 0%, #00FFFF 100%);
--gradient-danger: linear-gradient(135deg, #FF00FF 0%, #FF0044 100%);
--gradient-lab: linear-gradient(135deg, #AAFF00 0%, #00AAFF 50%, #FF00AA 100%);
--gradient-matrix: linear-gradient(180deg, transparent 0%, #00FF4120 50%, transparent 100%);

/* Animated Gradients */
--gradient-scan: linear-gradient(180deg, transparent 0%, #00FF41 50%, transparent 100%);
--gradient-pulse: radial-gradient(circle, #00FF4140 0%, transparent 70%);
```

---

## 2. Typography System

### Font Stack
```css
/* Primary Monospace Stack */
--font-mono-primary: 'JetBrains Mono', 'Fira Code', 'Source Code Pro', monospace;
--font-mono-secondary: 'IBM Plex Mono', 'Roboto Mono', 'Courier New', monospace;

/* Display Font for Headers */
--font-display: 'Space Mono', 'Share Tech Mono', monospace;

/* System Font for UI Elements */
--font-system: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

### Type Scale
```css
/* Terminal Text Sizes */
--text-nano: 10px;      /* Tiny annotations */
--text-micro: 11px;     /* Status bar */
--text-small: 12px;     /* Secondary info */
--text-base: 14px;      /* Standard terminal */
--text-medium: 16px;    /* Emphasized content */
--text-large: 20px;     /* Section headers */
--text-xlarge: 24px;    /* Major headers */
--text-display: 32px;   /* ASCII art headers */

/* Line Heights */
--line-tight: 1.2;      /* Compact terminal */
--line-normal: 1.5;     /* Standard readability */
--line-relaxed: 1.75;   /* Documentation */
```

### Text Effects
```css
/* Terminal Effects */
.text-glow {
  text-shadow: 
    0 0 10px currentColor,
    0 0 20px currentColor,
    0 0 30px currentColor;
}

.text-scan {
  background: linear-gradient(
    180deg,
    transparent 0%,
    currentColor 50%,
    transparent 100%
  );
  background-clip: text;
  animation: scan 2s linear infinite;
}

.text-glitch {
  animation: glitch 0.3s infinite;
  position: relative;
}

.text-glitch::before,
.text-glitch::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
}

.text-glitch::before {
  animation: glitch-1 0.5s infinite;
  color: var(--terminal-cyan);
  z-index: -1;
}

.text-glitch::after {
  animation: glitch-2 0.5s infinite;
  color: var(--terminal-magenta);
  z-index: -2;
}
```

---

## 3. Component Architecture

### Terminal Window Component
```css
.terminal-window {
  /* Glass Morphism Base */
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: 
    0 20px 40px var(--glass-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 80px var(--matrix-glow);
  
  /* Raised Effect */
  transform: translateZ(0);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.terminal-window:hover {
  transform: translateY(-2px) translateZ(0);
  box-shadow: 
    0 25px 50px var(--glass-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    0 0 120px var(--matrix-glow);
}

/* Terminal Header */
.terminal-header {
  background: linear-gradient(90deg, 
    rgba(0, 255, 65, 0.1) 0%, 
    rgba(0, 255, 255, 0.1) 100%
  );
  border-bottom: 1px solid var(--glass-border);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Terminal Controls */
.terminal-controls {
  display: flex;
  gap: 6px;
}

.terminal-control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 255, 65, 0.3);
  transition: all 0.2s;
}

.terminal-control.close {
  background: #FF0044;
}

.terminal-control.minimize {
  background: #FFAA00;
}

.terminal-control.maximize {
  background: #00FF41;
}

/* Terminal Body */
.terminal-body {
  padding: 20px;
  font-family: var(--font-mono-primary);
  font-size: var(--text-base);
  line-height: var(--line-normal);
  color: var(--terminal-green);
  min-height: 400px;
  overflow-y: auto;
}
```

### Command Prompt Variations
```css
/* Standard Prompt */
.prompt-standard::before {
  content: "lab@koH:~$ ";
  color: var(--terminal-cyan);
}

/* Root/Dangerous Mode */
.prompt-root::before {
  content: "lab@koH:~# ";
  color: var(--terminal-magenta);
  animation: pulse 1s infinite;
}

/* Scientific Prompts */
.prompt-molecule::before {
  content: "molecule://synthesis> ";
  color: var(--lab-acid);
}

.prompt-quantum::before {
  content: "quantum@lab//> ";
  color: var(--lab-plasma);
}

.prompt-neural::before {
  content: "neural.network::> ";
  color: var(--lab-cryo);
}

/* Status Indicators */
.prompt-processing::after {
  content: " ⚗️";
  animation: rotate 1s linear infinite;
}

.prompt-complete::after {
  content: " ✓";
  color: var(--state-success);
}

.prompt-error::after {
  content: " ✗";
  color: var(--state-error);
}
```

### Button System
```css
/* Base Button */
.btn-terminal {
  background: linear-gradient(135deg, 
    rgba(0, 255, 65, 0.1) 0%, 
    rgba(0, 255, 255, 0.1) 100%
  );
  border: 1px solid var(--terminal-green);
  color: var(--terminal-green);
  padding: 8px 16px;
  font-family: var(--font-mono-primary);
  font-size: var(--text-small);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover State */
.btn-terminal:hover {
  background: rgba(0, 255, 65, 0.2);
  box-shadow: 
    0 0 20px var(--terminal-green),
    inset 0 0 20px rgba(0, 255, 65, 0.1);
  transform: translateY(-1px);
}

/* Active State */
.btn-terminal:active {
  transform: translateY(0);
  box-shadow: 
    0 0 10px var(--terminal-green),
    inset 0 0 30px rgba(0, 255, 65, 0.2);
}

/* Dangerous Button */
.btn-danger {
  border-color: var(--terminal-magenta);
  color: var(--terminal-magenta);
  background: linear-gradient(135deg, 
    rgba(255, 0, 255, 0.1) 0%, 
    rgba(255, 0, 68, 0.1) 100%
  );
}

.btn-danger:hover {
  background: rgba(255, 0, 255, 0.2);
  box-shadow: 
    0 0 20px var(--terminal-magenta),
    inset 0 0 20px rgba(255, 0, 255, 0.1);
}

/* Lab Button Variants */
.btn-experiment {
  border-color: var(--lab-acid);
  color: var(--lab-acid);
  animation: pulse 2s infinite;
}

.btn-quantum {
  border-color: var(--lab-plasma);
  color: var(--lab-plasma);
  animation: quantum-flux 3s infinite;
}
```

### Loading States
```css
/* Chemical Reaction Loader */
.loader-chemical {
  width: 60px;
  height: 60px;
  position: relative;
}

.loader-chemical::before,
.loader-chemical::after {
  content: "⚗️";
  position: absolute;
  font-size: 30px;
  animation: bubble 2s infinite;
}

.loader-chemical::before {
  left: 0;
  animation-delay: 0s;
}

.loader-chemical::after {
  right: 0;
  animation-delay: 1s;
}

@keyframes bubble {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) scale(1.2);
    opacity: 0.7;
  }
}

/* DNA Helix Loader */
.loader-dna {
  width: 60px;
  height: 60px;
  position: relative;
}

.loader-dna::before,
.loader-dna::after {
  content: "";
  position: absolute;
  width: 4px;
  height: 100%;
  background: var(--terminal-green);
  animation: helix 1.5s linear infinite;
}

.loader-dna::before {
  left: 45%;
  animation-delay: 0s;
}

.loader-dna::after {
  right: 45%;
  animation-delay: 0.75s;
}

@keyframes helix {
  0% {
    transform: rotateY(0deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

/* Quantum State Loader */
.loader-quantum {
  width: 60px;
  height: 60px;
  border: 2px solid transparent;
  border-top-color: var(--lab-plasma);
  border-right-color: var(--lab-cryo);
  border-radius: 50%;
  animation: quantum-spin 1s linear infinite;
}

@keyframes quantum-spin {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(0.8);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}
```

### Error States
```css
/* Chemical Spill Error */
.error-chemical {
  background: linear-gradient(135deg, 
    rgba(255, 0, 68, 0.1) 0%, 
    rgba(255, 170, 0, 0.1) 100%
  );
  border: 1px solid var(--state-error);
  border-radius: 8px;
  padding: 16px;
  position: relative;
  overflow: hidden;
}

.error-chemical::before {
  content: "☣️ CONTAMINATION DETECTED ☣️";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: var(--state-error);
  color: black;
  padding: 4px;
  font-size: var(--text-micro);
  text-align: center;
  animation: blink 0.5s infinite;
}

/* System Overload Error */
.error-overload {
  animation: shake 0.5s infinite, glitch 0.3s infinite;
  border-color: var(--state-error);
  box-shadow: 
    0 0 40px var(--state-error),
    inset 0 0 40px rgba(255, 0, 68, 0.2);
}
```

---

## 4. Spacing & Layout System

### Grid System
```css
/* 8-Point Grid */
--space-0: 0;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;

/* Terminal-Specific Spacing */
--terminal-padding: 20px;
--terminal-line-spacing: 4px;
--terminal-prompt-spacing: 8px;
--terminal-output-spacing: 12px;
```

### Responsive Breakpoints
```css
--screen-xs: 320px;   /* Ultra mobile */
--screen-sm: 640px;   /* Mobile */
--screen-md: 768px;   /* Tablet */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Wide desktop */
--screen-2xl: 1536px; /* Ultra wide */
--screen-lab: 1920px; /* Laboratory display */
```

### Layout Patterns
```css
/* Terminal Pane Grid */
.terminal-grid {
  display: grid;
  gap: var(--space-4);
  padding: var(--space-4);
}

.terminal-grid-2x2 {
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.terminal-grid-sidebar {
  grid-template-columns: 300px 1fr;
}

.terminal-grid-triptych {
  grid-template-columns: 1fr 2fr 1fr;
}

/* Floating Terminal Layout */
.terminal-float {
  position: fixed;
  z-index: 1000;
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.terminal-float.draggable {
  cursor: move;
}

.terminal-float.resizable {
  resize: both;
  overflow: auto;
  min-width: 400px;
  min-height: 300px;
}
```

---

## 5. Animation System

### Core Animations
```css
/* Terminal Cursor */
@keyframes blink-cursor {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}

.cursor {
  display: inline-block;
  width: 10px;
  height: 20px;
  background: var(--terminal-green);
  animation: blink-cursor 1s infinite;
}

/* Command Execution */
@keyframes execute-command {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  50% {
    transform: translateX(10px);
    opacity: 0.7;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.executing {
  animation: execute-command 0.3s ease-out;
}

/* Matrix Background Intensity */
@keyframes matrix-intensity {
  0%, 100% {
    filter: brightness(0.8) contrast(1);
  }
  50% {
    filter: brightness(1.2) contrast(1.2);
  }
}

.matrix-active {
  animation: matrix-intensity 2s ease-in-out infinite;
}

/* Lab Particle Effects */
@keyframes particle-float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--lab-acid);
  border-radius: 50%;
  animation: particle-float 10s linear infinite;
}

/* Success Animation */
@keyframes success-pulse {
  0% {
    box-shadow: 0 0 0 0 var(--state-success);
  }
  70% {
    box-shadow: 0 0 0 20px transparent;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
}

.success {
  animation: success-pulse 1s ease-out;
}
```

### Micro-interactions
```css
/* Hover Transitions */
.interactive {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

/* Click Feedback */
.clickable:active {
  transform: scale(0.98);
  filter: brightness(0.9);
}

/* Focus States */
.focusable:focus {
  outline: 2px solid var(--terminal-cyan);
  outline-offset: 2px;
  box-shadow: 0 0 20px var(--terminal-cyan);
}

/* Tooltip Appearance */
.tooltip {
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Animation Timing Functions
```css
/* Easing Functions */
--ease-in-out-cubic: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
--ease-in-expo: cubic-bezier(0.95, 0.05, 0.795, 0.035);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);

/* Duration Scales */
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;
--duration-slowest: 1000ms;
```

---

## 6. ASCII Art Library

### Laboratory Equipment
```
/* Beaker */
    ___
   |   |
   |   |
   |___|
   \___/

/* Test Tube */
   ||
   ||
   ||
   \/

/* Molecule */
    O
   / \
  H   H

/* DNA Helix */
  /\/\/\
 |  ||  |
  \/\/\/

/* Atom */
    .--.
   /    \
  | (e-) |
   \    /
    '--'
```

### System Status Indicators
```
/* Processing */
[■□□□□□□□□□] 10%
[■■■■■□□□□□] 50%
[■■■■■■■■■■] 100%

/* Loading Spinner */
⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏

/* Status Icons */
✓ Success
✗ Error
⚠ Warning
ℹ Info
⚗ Processing
☣ Danger
⚡ Power
🧪 Experiment
```

---

## 7. Accessibility

### High Contrast Mode
```css
@media (prefers-contrast: high) {
  :root {
    --terminal-green: #00FF00;
    --terminal-cyan: #00FFFF;
    --glass-bg: rgba(0, 0, 0, 0.95);
    --glass-border: rgba(0, 255, 0, 0.5);
  }
  
  .terminal-window {
    border-width: 2px;
  }
  
  .terminal-body {
    font-weight: 500;
  }
}
```

### Dark Mode (Default)
```css
/* Already optimized for dark mode as primary */
```

### Light Mode Support
```css
@media (prefers-color-scheme: light) {
  :root {
    --terminal-green: #008020;
    --terminal-cyan: #0080A0;
    --glass-bg: rgba(255, 255, 255, 0.85);
    --glass-border: rgba(0, 128, 32, 0.2);
    --glass-shadow: rgba(0, 128, 32, 0.1);
  }
  
  .terminal-body {
    color: var(--terminal-green);
    background: rgba(240, 255, 240, 0.5);
  }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Indicators
```css
/* Keyboard Navigation */
.focusable:focus-visible {
  outline: 3px solid var(--terminal-cyan);
  outline-offset: 4px;
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--glass-bg);
  color: var(--terminal-green);
  padding: var(--space-2);
  text-decoration: none;
  z-index: 100000;
}

.skip-link:focus {
  top: 0;
}
```

### Screen Reader Support
```css
/* Visually Hidden but Accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Announce Dynamic Changes */
.sr-announce {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
```

---

## 8. Modal System

### Dangerous Mode Confirmation
```css
.modal-danger {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  z-index: 10000;
}

.modal-danger-content {
  background: var(--glass-bg);
  border: 2px solid var(--terminal-magenta);
  border-radius: 12px;
  padding: var(--space-8);
  max-width: 500px;
  animation: modal-appear 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 0 100px var(--terminal-magenta),
    inset 0 0 50px rgba(255, 0, 255, 0.1);
}

.modal-danger-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--terminal-magenta);
  font-size: var(--text-large);
  margin-bottom: var(--space-4);
}

.modal-danger-header::before {
  content: "⚠️";
  font-size: var(--text-xlarge);
  animation: pulse 1s infinite;
}

@keyframes modal-appear {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

---

## 9. Component States

### Interactive State Matrix
```css
/* Default → Hover → Active → Focus → Disabled */

/* Terminal Input States */
.terminal-input {
  /* Default */
  background: rgba(0, 255, 65, 0.05);
  border: 1px solid rgba(0, 255, 65, 0.3);
  color: var(--terminal-green);
  transition: all 0.2s var(--ease-in-out-cubic);
}

.terminal-input:hover {
  background: rgba(0, 255, 65, 0.1);
  border-color: rgba(0, 255, 65, 0.5);
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
}

.terminal-input:active {
  background: rgba(0, 255, 65, 0.15);
  border-color: var(--terminal-green);
  transform: translateY(1px);
}

.terminal-input:focus {
  outline: none;
  border-color: var(--terminal-cyan);
  box-shadow: 
    0 0 30px rgba(0, 255, 255, 0.3),
    inset 0 0 10px rgba(0, 255, 255, 0.1);
}

.terminal-input:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  background: rgba(0, 0, 0, 0.5);
}

/* Command States */
.command-valid {
  color: var(--state-success);
  border-left: 3px solid var(--state-success);
}

.command-invalid {
  color: var(--state-error);
  border-left: 3px solid var(--state-error);
  animation: shake 0.3s;
}

.command-processing {
  color: var(--state-processing);
  border-left: 3px solid var(--state-processing);
  animation: pulse 1s infinite;
}
```

---

## 10. Implementation Guidelines

### Performance Optimizations
- Use CSS transforms for animations (GPU acceleration)
- Implement virtual scrolling for long terminal outputs
- Lazy load ASCII art and complex animations
- Use CSS containment for terminal panes
- Implement debouncing for matrix rain intensity changes

### Browser Compatibility
- Target modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Use CSS custom properties with fallbacks
- Implement progressive enhancement for animations
- Test glass morphism effects across browsers
- Provide fallback for backdrop-filter

### Development Workflow
1. Start with semantic HTML structure
2. Apply base terminal styles
3. Add glass morphism effects
4. Implement interactive states
5. Add animations progressively
6. Test accessibility features
7. Optimize performance

### Component Composition
```jsx
// Example Terminal Component Structure
<TerminalWindow>
  <TerminalHeader>
    <TerminalControls />
    <TerminalTitle />
    <TerminalStatus />
  </TerminalHeader>
  <TerminalBody>
    <TerminalOutput />
    <TerminalPrompt />
    <TerminalInput />
  </TerminalBody>
  <TerminalFooter>
    <LabStatus />
    <SystemMetrics />
  </TerminalFooter>
</TerminalWindow>
```

---

## Color Usage Examples

### Success Operation
- Background: rgba(0, 255, 136, 0.1)
- Border: #00FF88
- Text: #00FF88
- Glow: 0 0 30px rgba(0, 255, 136, 0.5)

### Error State
- Background: rgba(255, 0, 68, 0.1)
- Border: #FF0044
- Text: #FF0044
- Glow: 0 0 30px rgba(255, 0, 68, 0.5)

### Processing State
- Background: rgba(170, 0, 255, 0.1)
- Border: #AA00FF
- Text: #AA00FF
- Animation: pulse 1s infinite

### Dangerous Mode
- Background: rgba(255, 0, 255, 0.1)
- Border: #FF00FF
- Text: #FF00FF
- Animation: electric-pulse 0.3s infinite

---

## ASCII Art Integration

### Welcome Screen
```
╔══════════════════════════════════════════╗
║     __         __  __   __            __  ║
║    / /  ___   / / / /  / /  ___ ____ / /  ║
║   / _ \/ _ \ / _ \/ /__/ _ \/ _ / _ / _/  ║
║  /_//_/\___//_//_/____/_//_/\_,_/___/___/ ║
║                                           ║
║         LABORATORY TERMINAL v2.0.0        ║
║            [QUANTUM ENHANCED]             ║
╚══════════════════════════════════════════╝
```

### Status Indicators
```
System Status: [OPTIMAL] ████████████ 100%
Quantum State: |ψ⟩ = α|0⟩ + β|1⟩
Lab Temp: 20°C ± 0.1
Experiments: 42 [RUNNING]
```

---

This design specification provides a complete visual system for the koH Labs terminal interface, combining professional Claude CLI aesthetics with cyberpunk laboratory themes for an "uber-leet" terminal experience.