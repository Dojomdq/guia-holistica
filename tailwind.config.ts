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
          100: "#f9f7f4",
          200: "#f2efe9",
          300: "#e8e3da",
          400: "#d9d1c4",
          500: "#c9bdae",
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
        ink: "#0f0e0c",
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
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-dm-mono)", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "500" }],
        "display-lg": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "500" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65" }],
        "body": ["1rem", { lineHeight: "1.65" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        "caption": ["0.75rem", { lineHeight: "1.5" }],
        "overline": ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.12em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-left": "slideInLeft 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "marquee": "marquee 30s linear infinite",
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      boxShadow: {
        "soft": "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
        "medium": "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
        "large": "0 4px 16px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.06)",
        "glow": "0 0 48px -12px rgba(93, 138, 110, 0.25)",
        "glow-lg": "0 0 80px -16px rgba(93, 138, 110, 0.35)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
