/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {},
    screens: {
      'sm': '640px',
      'md': '820px',
      'lg': '1120px',
      'xl': '1440px'
    }
  },
  plugins: [require('daisyui')],
}

