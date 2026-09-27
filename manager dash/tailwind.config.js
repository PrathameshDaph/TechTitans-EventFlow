/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F5EF',
        card: '#FFFFFF',
        primary: '#2B1A12',
        'primary-hover': '#3d251a',
        secondary: '#5A3826',
        'light-brown': '#8A6040',
        beige: '#EFE8DD',
        'beige-dark': '#E2D7C7',
        border: '#E5DED3',
        'main-text': '#2B211B',
        'secondary-text': '#766C63',
        'status-success': '#2E7D32',
        'status-success-bg': '#E8F5E9',
        'status-warning': '#B45309',
        'status-warning-bg': '#FEF3C7',
        'status-critical': '#B91C1C',
        'status-critical-bg': '#FEE2E2',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'card': '20px',
        'btn': '12px',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(43, 26, 18, 0.04), 0 1px 3px rgba(43, 26, 18, 0.02)',
        'medium': '0 8px 24px rgba(43, 26, 18, 0.07), 0 2px 6px rgba(43, 26, 18, 0.03)',
        'elevated': '0 16px 36px rgba(43, 26, 18, 0.12), 0 4px 12px rgba(43, 26, 18, 0.05)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow-glow': 'flowGlow 3s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        flowGlow: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(185, 28, 28, 0.4))' },
        }
      }
    },
  },
  plugins: [],
}
