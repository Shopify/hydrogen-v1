const path = require('path');

module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    'postcss-preset-env': {
      features: {'nesting-rules': false},
    },
    tailwindcss: {
      config: path.join(__dirname, 'tailwind.config.js'),
    },
  },
};
