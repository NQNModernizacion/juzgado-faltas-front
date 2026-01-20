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
      screens: { xs: '475px' },
    
      // colors: {
      //   primary: {
      //     50: "rgb(var(--primary-50) / <alpha-value>)",
      //     100: "rgb(var(--primary-100) / <alpha-value>)",
      //     200: "rgb(var(--primary-200) / <alpha-value>)",
      //     300: "rgb(var(--primary-300) / <alpha-value>)",
      //     400: "rgb(var(--primary-400) / <alpha-value>)",
      //     500: "rgb(var(--primary-500) / <alpha-value>)",
      //     600: "rgb(var(--primary-600) / <alpha-value>)",
      //     700: "rgb(var(--primary-700) / <alpha-value>)",
      //     800: "rgb(var(--primary-800) / <alpha-value>)",
      //     900: "rgb(var(--primary-900) / <alpha-value>)",
      //     950: "rgb(var(--primary-950) / <alpha-value>)",
      //     DEFAULT: "rgb(var(--primary-600) / <alpha-value>)",
      //   },
    
      //   secondary: {
      //     50: "rgb(var(--secondary-50) / <alpha-value>)",
      //     100: "rgb(var(--secondary-100) / <alpha-value>)",
      //     200: "rgb(var(--secondary-200) / <alpha-value>)",
      //     300: "rgb(var(--secondary-300) / <alpha-value>)",
      //     400: "rgb(var(--secondary-400) / <alpha-value>)",
      //     500: "rgb(var(--secondary-500) / <alpha-value>)",
      //     600: "rgb(var(--secondary-600) / <alpha-value>)",
      //     700: "rgb(var(--secondary-700) / <alpha-value>)",
      //     800: "rgb(var(--secondary-800) / <alpha-value>)",
      //     900: "rgb(var(--secondary-900) / <alpha-value>)",
      //     950: "rgb(var(--secondary-950) / <alpha-value>)",
      //     DEFAULT: "rgb(var(--secondary-500) / <alpha-value>)",
      //   },
    
      //   /* alias semántico opcional, sin romper nada */
      //   accent: {
      //     DEFAULT: "rgb(var(--secondary-500) / <alpha-value>)",
      //     700: "rgb(var(--secondary-700) / <alpha-value>)",
      //   },
    
      //   bg: "rgb(var(--bg) / <alpha-value>)",
      //   surface: "rgb(var(--surface) / <alpha-value>)",
      //   text: "rgb(var(--text) / <alpha-value>)",
      //   muted: "rgb(var(--muted) / <alpha-value>)",
      //   border: "rgb(var(--border) / <alpha-value>)",
      //   overlay: "rgb(var(--overlay) / <alpha-value>)",
      // },
      colors: {
        primary: {
          50: "rgb(var(--mx-primary-50) / <alpha-value>)",
          100: "rgb(var(--mx-primary-100) / <alpha-value>)",
          200: "rgb(var(--mx-primary-200) / <alpha-value>)",
          300: "rgb(var(--mx-primary-300) / <alpha-value>)",
          400: "rgb(var(--mx-primary-400) / <alpha-value>)",
          500: "rgb(var(--mx-primary-500) / <alpha-value>)",
          600: "rgb(var(--mx-primary-600) / <alpha-value>)",
          700: "rgb(var(--mx-primary-700) / <alpha-value>)",
          800: "rgb(var(--mx-primary-800) / <alpha-value>)",
          900: "rgb(var(--mx-primary-900) / <alpha-value>)",
          950: "rgb(var(--mx-primary-950) / <alpha-value>)",
          DEFAULT: "rgb(var(--mx-primary-600) / <alpha-value>)",
        },
      
        secondary: {
          50: "rgb(var(--mx-secondary-50) / <alpha-value>)",
          100: "rgb(var(--mx-secondary-100) / <alpha-value>)",
          200: "rgb(var(--mx-secondary-200) / <alpha-value>)",
          300: "rgb(var(--mx-secondary-300) / <alpha-value>)",
          400: "rgb(var(--mx-secondary-400) / <alpha-value>)",
          500: "rgb(var(--mx-secondary-500) / <alpha-value>)",
          600: "rgb(var(--mx-secondary-600) / <alpha-value>)",
          700: "rgb(var(--mx-secondary-700) / <alpha-value>)",
          800: "rgb(var(--mx-secondary-800) / <alpha-value>)",
          900: "rgb(var(--mx-secondary-900) / <alpha-value>)",
          950: "rgb(var(--mx-secondary-950) / <alpha-value>)",
          DEFAULT: "rgb(var(--mx-secondary-500) / <alpha-value>)",
        },
      
        /* si se quiere usar "accent" en algún lado, lo dejamos como alias */
        accent: {
          DEFAULT: "rgb(var(--mx-secondary-500) / <alpha-value>)",
          700: "rgb(var(--mx-secondary-700) / <alpha-value>)",
        },
      
        bg: "rgb(var(--mx-bg) / <alpha-value>)",
        surface: "rgb(var(--mx-surface) / <alpha-value>)",
        text: "rgb(var(--mx-text) / <alpha-value>)",
        muted: "rgb(var(--mx-muted) / <alpha-value>)",
        border: "rgb(var(--mx-border) / <alpha-value>)",
        overlay: "rgb(var(--mx-overlay) / <alpha-value>)",
      },
      
      borderRadius: {
        mx: "18px",
        mxlg: "22px",
      },
      boxShadow: {
        mx: "0 20px 60px rgba(0,0,0,0.18)",
        mxSoft: "0 12px 30px rgba(0,0,0,0.14)",
      },
    } 
  },
  plugins: [],
}
