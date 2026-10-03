/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: { fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] }, colors: { ink: '#17211d', leaf: '#3c795f', mint: '#e9f2ec' }, boxShadow: { card: '0 20px 70px rgba(31, 55, 43, .08)' } } },
  plugins: [],
};
