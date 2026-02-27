/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/muni-ui/**/*.{js,ts,jsx,tsx,mjs,cjs}",
  ],

  safelist: [
    // Si en algún componente generás clases dinámicas
    "bg-primary-400",
    "bg-primary-500",
    "border-primary-400",
    "text-primary-700",
    "bg-secondary-500",
    "border-border",
    "bg-surface",
    "text-text",
    "text-muted",

    // Si todavía usás file: variant (si lo pasás a CSS puro, podés borrar esto)
    "file:mr-4",
    "file:rounded-xl",
    "file:border-0",
    "file:px-4",
    "file:py-2",
    "file:bg-primary-400",
    "file:text-white",
    "file:font-semibold",
    "hover:file:bg-primary-500",
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.7rem",
        xs: "0.7rem",
        sm: "1rem",
        md: "1rem",
        lg: "2rem",
        xl: "3rem",
        "2xl": "4rem",
      },
      screens: {
        sm: "100%",
        md: "1024px",
        lg: "1280px",
        xl: "1536px",
      },
    },

    extend: {
      screens: { xs: "475px" },

      colors: {
        // -------- Brand
        primary: {
          50:  "rgb(var(--mx-primary-50,  var(--mx-primary-400)) / <alpha-value>)",
          100: "rgb(var(--mx-primary-100, var(--mx-primary-400)) / <alpha-value>)",
          200: "rgb(var(--mx-primary-200, var(--mx-primary-400)) / <alpha-value>)",
          300: "rgb(var(--mx-primary-300, var(--mx-primary-400)) / <alpha-value>)",
          400: "rgb(var(--mx-primary-400) / <alpha-value>)",
          500: "rgb(var(--mx-primary-500) / <alpha-value>)",
          600: "rgb(var(--mx-primary-600, var(--mx-primary-500)) / <alpha-value>)",
          700: "rgb(var(--mx-primary-700, var(--mx-primary-600, var(--mx-primary-500))) / <alpha-value>)",
          800: "rgb(var(--mx-primary-800, var(--mx-primary-700, var(--mx-primary-600, var(--mx-primary-500)))) / <alpha-value>)",
          900: "rgb(var(--mx-primary-900, var(--mx-primary-800, var(--mx-primary-700, var(--mx-primary-600, var(--mx-primary-500))))) / <alpha-value>)",
          950: "rgb(var(--mx-primary-950, var(--mx-primary-900, var(--mx-primary-800, var(--mx-primary-700, var(--mx-primary-600, var(--mx-primary-500)))))) / <alpha-value>)",
          DEFAULT: "rgb(var(--mx-primary-500) / <alpha-value>)",
        },

        secondary: {
          50:  "rgb(var(--mx-secondary-50,  var(--mx-secondary-500)) / <alpha-value>)",
          100: "rgb(var(--mx-secondary-100, var(--mx-secondary-500)) / <alpha-value>)",
          200: "rgb(var(--mx-secondary-200, var(--mx-secondary-500)) / <alpha-value>)",
          300: "rgb(var(--mx-secondary-300, var(--mx-secondary-500)) / <alpha-value>)",
          400: "rgb(var(--mx-secondary-400, var(--mx-secondary-500)) / <alpha-value>)",
          500: "rgb(var(--mx-secondary-500) / <alpha-value>)",
          600: "rgb(var(--mx-secondary-600, var(--mx-secondary-500)) / <alpha-value>)",
          700: "rgb(var(--mx-secondary-700, var(--mx-secondary-600, var(--mx-secondary-500))) / <alpha-value>)",
          800: "rgb(var(--mx-secondary-800, var(--mx-secondary-700, var(--mx-secondary-600, var(--mx-secondary-500)))) / <alpha-value>)",
          900: "rgb(var(--mx-secondary-900, var(--mx-secondary-800, var(--mx-secondary-700, var(--mx-secondary-600, var(--mx-secondary-500))))) / <alpha-value>)",
          950: "rgb(var(--mx-secondary-950, var(--mx-secondary-900, var(--mx-secondary-800, var(--mx-secondary-700, var(--mx-secondary-600, var(--mx-secondary-500)))))) / <alpha-value>)",
          DEFAULT: "rgb(var(--mx-secondary-500) / <alpha-value>)",
        },

        accent: {
          DEFAULT: "rgb(var(--mx-secondary-500) / <alpha-value>)",
          700: "rgb(var(--mx-secondary-700, var(--mx-secondary-600, var(--mx-secondary-500))) / <alpha-value>)",
        },

        // -------- UI neutrales
        bg: "rgb(var(--mx-bg) / <alpha-value>)",
        surface: "rgb(var(--mx-surface) / <alpha-value>)",
        text: "rgb(var(--mx-text) / <alpha-value>)",
        muted: "rgb(var(--mx-muted) / <alpha-value>)",
        border: "rgb(var(--mx-border) / <alpha-value>)",

        // -------- Semánticos (con fallbacks básicos)
        success: {
          50:  "rgb(var(--mx-success-50,  236 253 245) / <alpha-value>)",
          600: "rgb(var(--mx-success-600, 22 163 74) / <alpha-value>)",
          700: "rgb(var(--mx-success-700, 21 128 61) / <alpha-value>)",
        },
        warning: {
          50:  "rgb(var(--mx-warning-50,  255 251 235) / <alpha-value>)",
          500: "rgb(var(--mx-warning-500, 245 158 11) / <alpha-value>)",
          600: "rgb(var(--mx-warning-600, 217 119 6) / <alpha-value>)",
          700: "rgb(var(--mx-warning-700, 180 83 9) / <alpha-value>)",
        },
        danger: {
          50:  "rgb(var(--mx-danger-50,  254 242 242) / <alpha-value>)",
          600: "rgb(var(--mx-danger-600, 220 38 38) / <alpha-value>)",
          700: "rgb(var(--mx-danger-700, 185 28 28) / <alpha-value>)",
        },
        info: {
          50:  "rgb(var(--mx-info-50,  239 246 255) / <alpha-value>)",
          600: "rgb(var(--mx-info-600, 37 99 235) / <alpha-value>)",
          700: "rgb(var(--mx-info-700, 29 78 216) / <alpha-value>)",
        },
      },

      borderRadius: {
        mx: "18px",
        mxlg: "22px",
      },
      boxShadow: {
        mx: "0 20px 60px rgba(0,0,0,0.18)",
        mxSoft: "0 12px 30px rgba(0,0,0,0.14)",
      },
    },
  },

  plugins: [],
};
