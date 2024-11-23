/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'ping-slow': 'ping-slow 4s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slow-2': 'ping-slow 5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ping-slow-3': 'ping-slow 6s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1)', opacity: '0.3' },
          '100%': { transform: 'scale(1)', opacity: '0.5' },
        }
      }
    }
  },
  plugins: [],
}

