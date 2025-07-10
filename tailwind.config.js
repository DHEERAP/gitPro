/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        'git-green': '#28a745',
        'git-red': '#dc3545',
        'git-blue': '#007bff',
        'git-orange': '#fd7e14',
      },
    },
  },
  plugins: [],
};