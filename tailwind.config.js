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
        primary: '#00C076',
        negative: '#FF5B5B',
        background: '#1A1B1E',
        surface: '#2B2F36',
        'text-primary': '#FFFFFF',
        'text-secondary': '#808A9D',
      },
    },
  },
  plugins: [],
}
