/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', '"Cascadia Code"', 'monospace'],
      },
      colors: {
        muted: '#666',
        surface: '#fff',
        border: '#e0e0e0',
      },
    },
  },
  plugins: [],
}
