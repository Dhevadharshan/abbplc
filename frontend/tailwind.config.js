/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        industrial: {
          dark: "#060a10",
          surface: "#0f141e",
          border: "#1a2235",
          cyan: "#00f2ff",
          amber: "#ffab00",
          red: "#ff3e3e",
          green: "#00ff88",
          purple: "#a855f7",
          text: "#e2e8f0",
          muted: "#94a3b8"
        }
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(circle, #1e293b 1px, transparent 1px)",
        'grid-animated': `
          linear-gradient(rgba(0, 242, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 242, 255, 0.03) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid-size': "30px 30px",
        'grid-48': "48px 48px",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-in-up': 'slide-in-up 0.5s ease forwards',
        'fade-in': 'fade-in 0.4s ease forwards',
        'scan': 'scanline 6s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 242, 255, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 242, 255, 0.7)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'slide-in-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        scanline: {
          '0%': { top: '-2px' },
          '100%': { top: '100%' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 242, 255, 0.4)',
        'neon-amber': '0 0 20px rgba(255, 171, 0, 0.4)',
        'neon-green': '0 0 20px rgba(0, 255, 136, 0.4)',
        'neon-red': '0 0 20px rgba(255, 62, 62, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}
