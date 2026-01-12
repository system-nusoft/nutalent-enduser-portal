/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: '#D9D9D9',
        default: '#1B1B1B',
        subtext: '#616161',
        surface: '#FAFAFA',
        completed: '#29811E',
        incomplete: '#BFBFBF',
      }
    },
  },
  plugins: [],
};
