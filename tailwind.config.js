/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#030014",
        secondary: "#151312",
        light: {
          100: "#ebddd8",
          200: "#d99377",
          300: "#db805c",
          400: "#cd420b"
        },
        dark: {
          100: "#221f3d",
          200: "#0f0d23"
        },
        accent: "#657786",
        background: "#AB8BFF",

      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

