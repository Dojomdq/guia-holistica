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
          50: "#FEFCF9",
          100: "#FBF8F2",
          200: "#F5EFE3",
          300: "#EDE3D0",
          400: "#DDD0BA",
          500: "#C9B89E",
        },
        sage: {
          50: "#F0F5F1",
          100: "#DDE9E0",
          200: "#BDD4C2",
          300: "#94B89C",
          400: "#6E9A78",
          500: "#4F7D5A",
          600: "#3D6647",
          700: "#335239",
          800: "#2A422E",
          900: "#1F3323",
          950: "#121E16",
        },
        sand: {
          50: "#FCF8F2",
          100: "#F7F0E2",
          200: "#EEDDC4",
          300: "#E2C8A0",
          400: "#D4AE78",
          500: "#C89A58",
          600: "#B8854A",
          700: "#976C3E",
          800: "#7A5836",
          900: "#64492E",
        },
        clay: {
          50: "#FDF6F0",
          100: "#FAE8D8",
          200: "#F4CEB0",
          300: "#ECAD82",
          400: "#E28A54",
          500: "#D4703A",
          600: "#C45A2B",
          700: "#A44624",
          800: "#843A22",
          900: "#6B311E",
        },
        warmblack: {
          DEFAULT: "#2C2418",
          50: "#F8F6F4",
          100: "#ECE8E2",
          200: "#D8D1C6",
          300: "#BEB4A5",
          400: "#A09485",
          500: "#847868",
          600: "#6B6054",
          700: "#564C42",
          800: "#3E3830",
          900: "#332D24",
          950: "#2C2418",
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
        "marquee": "marquee 30s linear infinite",
        "pulse-subtle": "pulseSubtle 4s ease-in-out infinite",
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
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-33.333%)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      boxShadow: {
        "soft": "0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)",
        "medium": "0 2px 8px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.03)",
        "large": "0 4px 16px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.05)",
        "glow": "0 0 48px -12px rgba(79, 125, 90, 0.2)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
