/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0eaff',
          200: '#c0d3ff',
          300: '#93b3ff',
          400: '#6090ff',
          500: '#3b6eff',
          600: '#1f4fff',
          700: '#1a3de0',
          800: '#1a32b8',
          900: '#1c2f8f',
          950: '#131d5e',
        },
        surface: {
          0:   '#ffffff',
          50:  '#f8f9fc',
          100: '#f1f3f9',
          200: '#e4e8f2',
          300: '#cdd3e5',
          400: '#9aa3bf',
          500: '#6b7699',
          600: '#4a5478',
          700: '#333d60',
          800: '#1e2645',
          900: '#111830',
          950: '#080c1f',
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(17,24,48,0.06), 0 4px 16px 0 rgba(17,24,48,0.04)',
        'card-hover': '0 4px 12px 0 rgba(17,24,48,0.10), 0 8px 32px 0 rgba(17,24,48,0.08)',
        'glow': '0 0 20px rgba(59,110,255,0.25)',
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.25rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16,1,0.3,1)',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(16px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
      }
    },
  },
  plugins: [],
}