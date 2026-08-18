/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4f3ff",
          100: "#ebe8ff",
          200: "#d9d4ff",
          300: "#bbb0ff",
          400: "#9683ff",
          500: "#7c5cff",
          600: "#6c3ffa",
          700: "#5c2fe0",
          800: "#4b27b5",
          900: "#3f2390"
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
