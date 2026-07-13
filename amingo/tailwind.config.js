/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        goldlight: '#E9CE72',
        black: '#0A0A0A',
        charcoal: '#161616',
        charcoal2: '#1F1F1F',
        ivory: '#F6F3EC',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
