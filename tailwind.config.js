/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Manrope', 'sans-serif'],
      },
      colors: {
        ink: '#192820',
        forest: '#214b39',
        moss: '#d8e6ca',
        paper: '#f6f7f2',
        lime: '#d6f379',
      },
      boxShadow: {
        card: '0 12px 40px rgba(32, 53, 40, .055)',
      },
    },
  },
  plugins: [],
}
