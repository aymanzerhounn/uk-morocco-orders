/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          pink: '#FF6B9D',
          orange: '#FF8C42',
          green: '#4ADE80',
          blue: '#60A5FA',
          dark: '#0f0f1a',
          card: '#1a1a2e',
          border: '#2a2a4a'
        }
      }
    },
  },
  plugins: [],
}
