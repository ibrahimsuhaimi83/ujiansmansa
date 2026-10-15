/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eff6ff",
          100: "#dbeafe",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#102a43",
          950: "#0b1f33",
        },
      },
    },
  },
  plugins: [],
};
