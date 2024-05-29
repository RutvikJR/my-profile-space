/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],  theme: {
    extend: {
      colors: {
        theme1: '#DDE6ED',
        theme2: '#acb3b7',
        theme3: '#16263d',
      },
    },
  },
  plugins: [],
}

