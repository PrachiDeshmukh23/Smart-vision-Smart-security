/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#009B72',
          dark: '#007A5A',
          darker: '#005840',
          light: '#E8F8F3',
          surface: '#F0FAF6',
        },
        accent: {
          orange: '#FF5A2C',
          amber: '#F59E0B',
          red: '#EF4444',
          blue: '#2563EB',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          light: '#F7F8F8',
          subtle: '#F1F3F5',
          border: '#E6E6E6',
          borderDark: '#D1D5DB',
        },
        charcoal: {
          900: '#151515',
          800: '#262626',
          700: '#404040',
          600: '#666666',
          500: '#8C8C8C',
          400: '#B3B3B3',
        },
        brand: {
          navy: '#0B192C',
          dark: '#1E3E62',
          blue: '#008DDA',
          cyan: '#00D2FF',
          light: '#F8FAFC',
          border: '#E2E8F0',
          accent: '#FF5A2C',
          emerald: '#009B72'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 12px 28px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04)',
        'teal-sm': '0 2px 8px rgba(0, 155, 114, 0.18)',
        'teal-md': '0 6px 16px rgba(0, 155, 114, 0.25)',
        'brand': '0 10px 25px -5px rgba(0, 155, 114, 0.15)',
        'glow': '0 0 20px rgba(0, 155, 114, 0.35)',
        'glow-orange': '0 0 20px rgba(255, 90, 44, 0.35)',
      }
    },
  },
  plugins: [],
}
