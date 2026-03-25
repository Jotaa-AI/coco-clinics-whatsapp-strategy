/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a1a',
        'bg-secondary': '#111128',
        'bg-card': 'rgba(20, 20, 50, 0.6)',
        'bg-card-hover': 'rgba(30, 30, 70, 0.7)',
        'border-color': 'rgba(108, 99, 255, 0.15)',
        'text-primary': '#e8e8f0',
        'text-secondary': '#9595b8',
        'text-muted': '#6a6a8a',
        'accent-purple': '#6C63FF',
        'accent-pink': '#FF6B9D',
        'accent-teal': '#4ECDC4',
        'accent-yellow': '#FFD93D',
        'accent-green': '#95E1D3',
        'accent-red': '#F38181',
        'sidebar-color': 'rgba(15, 15, 35, 0.95)',
        'wa-green': '#005C4B',
        'wa-bubble': '#1B3A33',
        'wa-bubble-light': '#D9FDD3',
      },
    },
  },
  plugins: [],
}
