/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F7F4ED',
        cream: '#EFE8DB',
        card: '#FFFEFB',
        border: '#E4DED3',
        primary: {
          DEFAULT: '#2B1710',
          dark: '#1C0F0A',
          light: '#422820',
        },
        text: {
          primary: '#2A211D',
          secondary: '#756D66',
          muted: '#9C948B',
        },
        accent: {
          success: '#2F7D45',
          warning: '#D9822B',
          critical: '#D92D3A',
          info: '#2B6CB0',
          purple: '#6B46C1',
        }
      },
      fontFamily: {
        sans: ['"Outfit"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Outfit"', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px -1px rgba(43, 23, 16, 0.04), 0 1px 3px -1px rgba(43, 23, 16, 0.02)',
        'card': '0 4px 20px -2px rgba(43, 23, 16, 0.06), 0 2px 6px -1px rgba(43, 23, 16, 0.03)',
        'floating': '0 12px 36px -4px rgba(43, 23, 16, 0.12), 0 4px 12px -2px rgba(43, 23, 16, 0.06)',
        'glow-warning': '0 0 20px rgba(217, 130, 43, 0.25)',
        'glow-critical': '0 0 20px rgba(217, 45, 58, 0.25)',
        'glow-success': '0 0 20px rgba(47, 125, 69, 0.25)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.05)' },
        },
        cascadeFlow: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cascade': 'cascadeFlow 1.8s ease-in-out infinite',
        'ripple': 'ripple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      }
    },
  },
  plugins: [],
}
