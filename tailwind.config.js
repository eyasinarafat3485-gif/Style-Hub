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
          50: '#fff1f4',
          100: '#ffe3ea',
          200: '#ffc7d4',
          300: '#ff9cb3',
          400: '#ff5c84',
          500: '#ff2056', // Primary brand color from user's image
          600: '#e01648',
          700: '#c20e3a',
          800: '#a30c31',
          900: '#850d2c',
          950: '#4d0315',
        },
        accent: {
          coral: '#d9534f',
          tan: '#e6dfd5',
          gold: '#c59d5f',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
