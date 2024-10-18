/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/ui/src/**/*.{html,ts}',
    './libs/web/**/src/**/*.{html,ts}',
    './libs/shared/components/**/src/**/*.{html,ts}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

