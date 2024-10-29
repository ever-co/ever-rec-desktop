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
        }
      }
    },
  },
  plugins: [],
};
