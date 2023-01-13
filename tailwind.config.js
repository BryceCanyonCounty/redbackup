/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
    },
  },
  content: [
    "./src/renderer/index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  plugins: [
  ],
}