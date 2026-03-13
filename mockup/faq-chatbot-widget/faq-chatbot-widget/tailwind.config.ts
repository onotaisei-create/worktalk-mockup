import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  important: '#faq-chatbot-root',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8f0fe',
          100: '#d2e3fc',
          200: '#a8c7fa',
          300: '#74a9f5',
          400: '#4285f4',
          500: '#1a73e8',
          600: '#1557b0',
          700: '#0f47a0',
          800: '#0d3880',
          900: '#082d6a',
        },
        accent: {
          50: '#fff1f0',
          100: '#ffe4e1',
          200: '#ffccc7',
          300: '#ffa8a0',
          400: '#ff7a6d',
          500: '#e63946',
          600: '#d62839',
          700: '#b91c2e',
          800: '#9a1a2a',
          900: '#801b27',
        },
        ocean: {
          light: '#7ed6df',
          DEFAULT: '#22a6b3',
          dark: '#0c7489',
        },
      },
    },
  },
  plugins: [],
}
export default config
