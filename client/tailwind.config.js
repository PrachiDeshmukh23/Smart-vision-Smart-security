/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0B192C',
          dark: '#1E3E62',
          blue: '#008DDA',
          cyan: '#00D2FF',
          light: '#F8FAFC',
          border: '#E2E8F0',
          accent: '#FF6B00',
          emerald: '#10B981'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 10px 25px -5px rgba(0, 141, 218, 0.1), 0 8px 10px -6px rgba(0, 141, 218, 0.1)',
        'glow': '0 0 20px rgba(0, 210, 255, 0.35)',
        'glow-orange': '0 0 20px rgba(255, 107, 0, 0.35)',
      }
    },
  },
  plugins: [],
}
