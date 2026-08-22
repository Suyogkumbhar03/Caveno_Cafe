/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'caveno-black': '#0B0A0A',
        'caveno-dark': '#141211',
        'caveno-card': '#1B1816',
        'caveno-gold': '#C5A880',
        'caveno-amber': '#E5A853',
        'caveno-cream': '#F3EEEA',
        'caveno-muted': '#8E8780',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
