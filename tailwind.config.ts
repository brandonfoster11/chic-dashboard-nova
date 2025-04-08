import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9b87f5",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#F2FCE2",
          foreground: "#1A1F2C",
        },
        accent: {
          DEFAULT: "#FFDEE2",
          foreground: "#1A1F2C",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1A1F2C",
        },
        gray: {
          60: '#BFCBD4',
          70: '#D1D6E0',
          80: '#E0E4EB',
          90: '#F0F1F5',
          100: '#FFFFFF',
          'dark-60': '#667085',
          'dark-70': '#4E5766',
          'dark-80': '#37404F',
          'dark-90': '#202531',
          'dark-100': '#0A0E15',
        },
      },
      boxShadow: {
        neumorphic: 'inset 43px 31px 43px rgba(255,255,255,0.64), inset -26px -26px 48px rgba(13,39,80,0.16)',
        'neumorphic-button': '4px 4px 10px rgba(0,0,0,0.06), -4px -4px 10px rgba(255,255,255,0.8), inset 1px 1px 1px rgba(255,255,255,0.5)',
        'neumorphic-card': '8px 8px 16px rgba(0,0,0,0.05), -8px -8px 16px rgba(255,255,255,0.8)',
        'neumorphic-inset': 'inset 4px 4px 8px rgba(0,0,0,0.05), inset -4px -4px 8px rgba(255,255,255,0.8)',
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;