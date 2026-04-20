import type { Config } from 'tailwindcss'

export default {
  content: [
    "./www/index.html",
    "./www/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [],
} satisfies Config