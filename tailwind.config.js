/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'xflix-dark': '#141414',
        'xflix-darker': '#0b0b0b',
        'xflix-red': '#E50914',
      },
    },
  },
  plugins: [],
}