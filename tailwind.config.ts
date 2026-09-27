import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#fff8f5",
          dim: "#e2d8d2",
          bright: "#fff8f5",
          variant: "#eae1da",
        },
        "surface-container": {
          lowest: "#ffffff",
          low: "#fcf2eb",
          DEFAULT: "#f6ece6",
          high: "#f0e6e0",
          highest: "#eae1da",
        },
        "on-surface": {
          DEFAULT: "#1f1b17",
          variant: "#3e4947",
        },
        primary: {
          DEFAULT: "#005c55",
          container: "#0f766e",
          fixed: "#9cf2e8",
          "fixed-dim": "#80d5cb",
        },
        secondary: {
          DEFAULT: "#795900",
          container: "#ffc641",
          fixed: "#ffdfa0",
          "fixed-dim": "#f6be39",
        },
        tertiary: {
          DEFAULT: "#005f26",
          container: "#007a33",
          fixed: "#7ffc97",
          "fixed-dim": "#62df7d",
        },
        outline: {
          DEFAULT: "#6e7977",
          variant: "#bdc9c6",
        },
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        background: "#fff8f5",
        foreground: "#1f1b17",
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2rem",
        gutter: "1rem",
        margin: "1rem",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        marquee: "marquee 20s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
