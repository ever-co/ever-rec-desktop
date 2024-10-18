/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/ui/src/**/*.{html,ts}',
    './libs/web/**/src/**/*.{html,ts}',
    './libs/shared/components/**/src/**/*.{html,ts}',
    './node_modules/@angular/material/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

