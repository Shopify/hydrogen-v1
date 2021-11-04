export default function () {
  return `
module.exports = {
  purge: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
`;
}
