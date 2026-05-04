/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arenaYellow: '#FDB912',
        arenaRed: '#A90432',
      }
    },
  },
  plugins: [],
}