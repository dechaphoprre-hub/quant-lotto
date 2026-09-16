/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#080C14',
          card: '#0F1626',
          border: '#1E293B',
          hover: '#1B253B',
          cyan: '#00F2FE',
          green: '#10B981',
          amber: '#F59E0B',
          purple: '#8B5CF6',
          rose: '#F43F5E',
          muted: '#64748B',
          text: '#F8FAFC'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
