/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0E0C0A',
        surface: {
          DEFAULT: '#14110E',
          card: '#1A1613',
          elevated: '#211C18',
          border: '#2E2721',
          hover: '#29231E',
        },
        brand: {
          DEFAULT: '#D88D41',
          hover: '#C37B31',
          light: '#E29D52',
          muted: '#8A5C2B',
          bg: '#2A1F16',
        },
        text: {
          primary: '#F5F2EB',
          secondary: '#A69E94',
          muted: '#746D64',
          inverse: '#0E0C0A',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.8s infinite',
        glow: 'pulseGlow 2.5s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}
