/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Heebo"', '"Rubik"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.06)',
        soft: '0 8px 24px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}
