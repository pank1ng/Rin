/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector','[data-color-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        'theme': '#0A84FF',
        'theme-hover': '#0077ED',
        'theme-active': '#0060DF',
        'background': {
          'light': '#eef3fb',
          'dark': '#09111f',
        },
        'dark': "#162033"
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

