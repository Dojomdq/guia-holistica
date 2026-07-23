import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdfcfa",
          100: "#faf9f7",
          200: "#f5f3ef",
          300: "#ede9e3",
          400: "#e2dcd3",
          500: "#d4cbc0",
        },
        sage: {
          50: "#f4f7f5",
          100: "#e6ede8",
          200: "#cddbd2",
          300: "#a8c2b0",
          400: "#7da48c",
          500: "#5d8a6e",
          600: "#4a7c59",
          700: "#3d6449",
          800: "#33503c",
          900: "#2b4233",
          950: "#15231b",
        },
        sand: {
          50: "#faf8f5",
          100: "#f3efe8",
          200: "#e6ddd0",
          300: "#d5c7b0",
          400: "#c4a882",
          500: "#b8956a",
          600: "#ab835e",
          700: "#8e6b4f",
          800: "#745744",
          900: "#5f483a",
        },
        warmblack: {
          DEFAULT: "#1a1714",
          50: "#f7f6f5",
          100: "#e8e6e3",
          200: "#d3cfc9",
          300: "#b5aea4",
          400: "#968c7f",
          500: "#7a7066",
          600: "#635a52",
          700: "#514a44",
          800: "#3a3632",
          900: "#2a2724",
          950: "#1a1714",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "fade-in-down": "fadeInDown 0.6s ease-out forwards",
        "fade-in-left": "fadeInLeft 0.8s ease-out forwards",
        "fade-in-right": "fadeInRight 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 4s ease-in-out infinite",
        "word-rotate": "wordRotate 18s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        wordRotate: {
          "0%, 20%": { transform: "translateY(0)" },
          "25%, 45%": { transform: "translateY(-100%)" },
          "50%, 70%": { transform: "translateY(-200%)" },
          "75%, 95%": { transform: "translateY(-300%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.04), 0 10px 20px -2px rgba(0, 0, 0, 0.02)",
        medium:
          "0 4px 25px -5px rgba(0, 0, 0, 0.06), 0 10px 30px -5px rgba(0, 0, 0, 0.03)",
        large:
          "0 10px 50px -12px rgba(0, 0, 0, 0.08), 0 20px 40px -10px rgba(0, 0, 0, 0.04)",
        glow: "0 0 40px -10px rgba(93, 138, 110, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
