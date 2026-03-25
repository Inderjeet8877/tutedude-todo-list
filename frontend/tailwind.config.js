export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          bg: '#0a0a0c',
          surface: '#131315',
          surfaceVariant: '#1c1c1f',
          primary: '#00d1ff',
          secondary: '#ff2a85',
          tertiary: '#00ffaa',
          error: '#ff3366',
          text: '#ffffff',
          textMuted: '#8b8b93'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
