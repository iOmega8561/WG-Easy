import { Config } from 'tailwindcss'

export default {
  content: [
    "./www/index.html",
    "./www/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config