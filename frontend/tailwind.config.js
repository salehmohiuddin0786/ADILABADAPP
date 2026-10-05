/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./layouts/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9effe',
          200: '#bce2fe',
          300: '#8eccfd',
          400: '#58aefb',
          500: '#308ff7',
          600: '#1b71eb',
          700: '#155cd8',
          800: '#174bae',
          900: '#184289',
          950: '#132954'
        },
        emerald: {
          500: '#10b981',
          600: '#059669'
        },
        amber: {
          500: '#f59e0b',
          600: '#d97706'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'hover': '0 12px 30px -5px rgba(27, 113, 235, 0.15)'
      }
    },
  },
  plugins: [],
}
