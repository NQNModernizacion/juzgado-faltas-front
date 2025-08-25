/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '0.7rem',
        xs: '0.7rem',
        sm: '1rem',
        md: '1rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
      },
      screens: {
        sm: '100%',
        md: '1024px',
        lg: '1280px',
        xl: '1536px',
      },
    },
    extend: {
      screens: {
        xs: '475px',
      },
      colors: {
        primary: {
          default: '#1134c9',
          50: '#e9f6ff',
          100: '#d7ecff',
          200: '#b8dbff',
          300: '#8dc1ff',
          400: '#6099ff',
          500: '#3c72ff',
          600: '#1a45ff',
          700: '#1038f2',
          800: '#1134c9',
          900: '#173298',
          950: '#0e1d58',
        },
        secondary: {
          default: '#30b6ed',
          50: '#f1f9fe',
          100: '#e1f2fd',
          200: '#bde6fa',
          300: '#83d3f6',
          400: '#30b6ed',
          500: '#19a4de',
          600: '#0c84bd',
          700: '#0b6999',
          800: '#0d597f',
          900: '#114a69',
          950: '#0b2f46',
        },
      },
    },
  },
  plugins: [],
}
