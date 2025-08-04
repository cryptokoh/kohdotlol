# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite project using JavaScript (not TypeScript). It's a standard Vite React template with minimal setup.

## Essential Commands

```bash
# Development
npm run dev          # Start dev server with hot module replacement (HMR)

# Build
npm run build        # Build for production

# Preview
npm run preview      # Preview production build locally

# Linting
npm run lint         # Run ESLint
```

## Project Architecture

### Technology Stack
- **Build Tool**: Vite 7.x
- **Framework**: React 19.x
- **Language**: JavaScript (ES modules)
- **Styling**: Tailwind CSS 4.x
- **Linting**: ESLint 9.x with React-specific plugins

### Key Configuration Files
- `vite.config.js`: Vite configuration with React plugin
- `eslint.config.js`: ESLint configuration using new flat config format
- `tailwind.config.js`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS configuration for Tailwind
- `index.html`: Entry HTML file (Vite serves this directly)

### Source Structure
- `src/main.jsx`: Application entry point, mounts React to DOM
- `src/App.jsx`: Main React component
- `src/index.css`: Tailwind CSS directives
- `public/`: Static assets served directly by Vite

### Development Workflow
- Vite handles HMR automatically when files are saved
- ESLint is configured to allow unused vars starting with uppercase letters or underscores
- React Refresh plugin ensures component state is preserved during HMR
- Tailwind CSS classes are compiled via PostCSS during build
- Use Tailwind utility classes for styling instead of CSS files