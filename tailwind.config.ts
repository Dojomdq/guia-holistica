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
          50: "#FDFBF7",
          100: "#FAF6EE",
          200: "#F3EDE0",
          300: "#E8DFD0",
          400: "#D8C9B5",
          500: "#C4B199",
        },
        sage: {
          50: "#F2F6F3",
          100: "#E1EAE3",
          200: "#C3D5C7",
          300: "#9DB8A5",
          400: "#7A9E84",
          500: "#5C8468",
          600: "#486B53",
          700: "#3A5643",
          800: "#2F4537",
          900: "#24362B",
          950: "#151F1A",
        },
        sand: {
          50: "#FDF8F0",
          100: "#FAF0DE",
          200: "#F2DEBC",
          300: "#E8C894",
          400: "#DCAE6C",
          500: "#D09A4E",
          600: "#C08540",
          700: "#9E6A35",
          800: "#805530",
          900: "#69462A",
        },
        terracotta: {
          50: "#FDF5F0",
          100: "#FAE8DB",
          200: "#F4CEB5",
          300: "#ECAD88",
          400: "#E28A58",
          500: "#D6703E",
          600: "#C45A2E",
          700: "#A44626",
          800: "#843A24",
          900: "#6B3120",
        },
        bark: {
          DEFAULT: "#2A1F14",
          50: "#F8F6F3",
          100: "#EDE8E2",
          200: "#D6CEC3",
          300: "#BDB1A1",
          400: "#A09280",
          500: "#847564",
          600: "#6B5D4E",
          700: "#564A3E",
          800: "#3E3630",
          900: "#332C26",
          950: "#2A1F14",
        },
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        mono: ["var(--font-dm-mono)", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6.5vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.03em", fontWeight: "500" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 4rem)", { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "500" }],
        "display-md": ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        "body": ["1rem", { lineHeight: "1.7" }],
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
          "100%": { transform: "translateX(-50%)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      boxShadow: {
        "soft": "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)",
        "medium": "0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)",
        "large": "0 4px 16px rgba(0,0,0,0.07), 0 16px 48px rgba(0,0,0,0.06)",
        "glow": "0 0 48px -12px rgba(92, 132, 104, 0.25)",
        "glow-lg": "0 0 64px -16px rgba(92, 132, 104, 0.35)",
        "warm": "0 4px 24px rgba(42, 31, 20, 0.12)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
