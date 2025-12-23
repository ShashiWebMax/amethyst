/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.html",
    "./public/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        amethyst: '#7B61FF',
        'amethyst-dark': '#5a46cc',
      },
    },
  },
  plugins: [],
}
