const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#e6f1ff',
          200: '#bcd9ff',
          600: '#2563eb',
        },
      },
      keyframes: {
        hourglass: {
          '0%, 20%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(-180deg)' },
          '70%, 100%': { transform: 'rotate(0deg)' },
        },
      },
      animation: {
        hourglass: 'hourglass 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
