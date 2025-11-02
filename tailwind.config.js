/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#78c8ff',
        secondary: '#8aa3ff',
        accent: '#b084ff',
        dark: '#0b1020',
      },
      backgroundImage: {
        'gradient-asenay': 'linear-gradient(135deg, #78c8ff 0%, #8aa3ff 50%, #b084ff 100%)',
      },
    },
  },
  plugins: [],
}


