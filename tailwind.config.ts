import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
        },
        sage: {
          50: "#F2F8F7",
          100: "#DFEEEC",
          200: "#BFDDD9",
          300: "#96C5BF",
          400: "#6DA8A0",
          500: "#5A8F8F",
          600: "#4A7676",
          700: "#3B5E5E",
          800: "#2E4A4A",
          900: "#1E3232",
          950: "#142222",
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
          50: "#FDF6F3",
          100: "#F9E8DF",
          200: "#F3D0BC",
          300: "#EAB095",
          400: "#E28A68",
          500: "#D4836D",
          600: "#B5654F",
          700: "#964F3F",
          800: "#7A4033",
          900: "#65362B",
        },
        bark: {
          DEFAULT: "#0F1B2D",
          50: "#F4F6F8",
          100: "#E2E6EC",
          200: "#C5CCD9",
          300: "#A8B3C6",
          400: "#8B99B3",
          500: "#6E80A0",
          600: "#51678D",
          700: "#3A4E73",
          800: "#2A3B5A",
          900: "#1A2840",
          950: "#0F1B2D",
        },
        warmblack: "#3B5E5E",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-cabinet)", "Cabinet Grotesk", "sans-serif"],
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
        "glow": "0 0 48px -12px rgba(90, 143, 143, 0.25)",
        "glow-lg": "0 0 64px -16px rgba(90, 143, 143, 0.35)",
        "warm": "0 4px 24px rgba(15, 27, 45, 0.12)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
