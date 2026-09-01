/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'araina-pink': '#EF5F7D',
        'araina-blue': '#6CADBA',
        'araina-white': '#FFFFFF',
        'araina-black': '#000000',
      },
      fontFamily: {
        unbounded: ['Unbounded', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

