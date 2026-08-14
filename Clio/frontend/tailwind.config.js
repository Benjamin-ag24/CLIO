/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cafe: {
          50: "#FCFAF7",
          100: "#F7F2EC",
          200: "#E9E1D3",
          300: "#E8DDD0",
          400: "#B3A392",
          500: "#93816F",
          600: "#7B5F49",
          700: "#5B3F2D",
          800: "#4A3226",
        },
        celeste: {
          100: "#DCEBF3",
          300: "#7FB3D1",
          400: "#6FA8C9",
          500: "#6A9EB8",
          900: "#2F4858",
        },
        beige: {
          50: "#FCFAF7",
          100: "#F7F2EC",
          200: "#F3E7DC",
        },
        "verde-veraz": {
          100: "#EAF5EC",
          700: "#3E7C50",
        },
        "rojo-falso": {
          100: "#FBEAE8",
          700: "#C3564F",
          800: "#A9433D",
        },
        "amarillo-dudoso": {
          100: "#F1DFC0",
          700: "#8C6239",
        },
      },
    },
  },
  plugins: [],
};