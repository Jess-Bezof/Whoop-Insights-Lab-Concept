/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whoop: {
          black: '#121212', // Slightly lighter than pure black for dashboard bg
          card: '#1B1B1B',  // Dark gray for cards
          monitor: {
            bg: '#121417',
            border: '#22262B',
          },
          border: 'rgba(255, 255, 255, 0.1)', // Subtle border
          text: '#FFFFFF',
          textDim: '#A0A0A0',
          sleep: '#66CCFF',   // Cyan/Blue
          recovery: '#00E266', // Green
          strain: '#0099FF',   // Deep Blue
          red: '#FF3B30',
          yellow: '#FFCC00',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'whoop-gradient': 'linear-gradient(to bottom, #1a1a1a 0%, #121212 100%)',
      }
    },
  },
  plugins: [],
}
