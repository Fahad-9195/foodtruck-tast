/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F4F8FC",
        section: "#EEF5FF",
        surface: "#FFFFFF",
        soft: "#F7FBFF",
        primary: {
          DEFAULT: "#169BFF",
          dark: "#0D8AF0"
        },
        accent: {
          cyan: "#6DD3FF",
          violet: "#8B7CFF"
        },
        ink: {
          DEFAULT: "#0F172A",
          body: "#475569",
          muted: "#7B8AA0"
        },
        line: "#D9E7F5",
        brand: {
          50: "#f2f8ff",
          100: "#d9ebff",
          500: "#169BFF",
          600: "#0D8AF0",
          900: "#0F172A"
        }
      }
    }
  },
  plugins: []
};
