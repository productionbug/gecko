import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,scss,css}", "./styles.scss"],
  safelist: ["border-red-300", "text-red-500"],
  plugins: [],
  theme: {
    extend: {
      colors: {
        // Brand colors (Primary)
        primary: {
          50: "rgb(var(--hpui-primary-50) / <alpha-value>)",
          100: "rgb(var(--hpui-primary-100) / <alpha-value>)",
          200: "rgb(var(--hpui-primary-200) / <alpha-value>)",
          300: "rgb(var(--hpui-primary-300) / <alpha-value>)",
          400: "rgb(var(--hpui-primary-400) / <alpha-value>)",
          500: "rgb(var(--hpui-primary-500) / <alpha-value>)",
          600: "rgb(var(--hpui-primary-600) / <alpha-value>)",
          700: "rgb(var(--hpui-primary-700) / <alpha-value>)",
          800: "rgb(var(--hpui-primary-800) / <alpha-value>)",
          900: "rgb(var(--hpui-primary-900) / <alpha-value>)",
          950: "rgb(var(--hpui-primary-950) / <alpha-value>)"
        },

        // Semantic surface/background colors
        surface: {
          primary: "rgb(var(--hpui-surface-primary) / <alpha-value>)",
          secondary: "rgb(var(--hpui-surface-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--hpui-surface-tertiary) / <alpha-value>)",
          hover: "rgb(var(--hpui-surface-hover) / <alpha-value>)",
          "hover-strong": "rgb(var(--hpui-surface-hover-strong) / <alpha-value>)",
          active: "rgb(var(--hpui-surface-active) / <alpha-value>)",
          disabled: "rgb(var(--hpui-surface-disabled) / <alpha-value>)",
          overlay: "rgb(var(--hpui-surface-overlay) / <alpha-value>)",
          autofill: "rgb(var(--hpui-surface-autofill) / <alpha-value>)"
        },

        // Semantic text colors
        text: {
          primary: "rgb(var(--hpui-text-primary) / <alpha-value>)",
          secondary: "rgb(var(--hpui-text-secondary) / <alpha-value>)",
          tertiary: "rgb(var(--hpui-text-tertiary) / <alpha-value>)",
          disabled: "rgb(var(--hpui-text-disabled) / <alpha-value>)",
          placeholder: "rgb(var(--hpui-text-placeholder) / <alpha-value>)",
          inverse: "rgb(var(--hpui-text-inverse) / <alpha-value>)",
          muted: "rgb(var(--hpui-text-muted) / <alpha-value>)"
        },

        // Semantic border colors
        border: {
          primary: "rgb(var(--hpui-border-primary) / <alpha-value>)",
          secondary: "rgb(var(--hpui-border-secondary) / <alpha-value>)",
          focus: "rgb(var(--hpui-border-focus) / <alpha-value>)",
          hover: "rgb(var(--hpui-border-hover) / <alpha-value>)",
          disabled: "rgb(var(--hpui-border-disabled) / <alpha-value>)"
        }
      },

      // Extend outline colors for focus states
      outlineColor: {
        focus: "rgb(var(--hpui-border-focus))"
      }
    }
  }
};

export default config;
