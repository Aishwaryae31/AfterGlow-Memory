import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        blush: {
          50: "#fff5f7",
          100: "#ffe4ea",
          200: "#ffc9d6",
          300: "#ffa3ba",
          400: "#ff7a9a",
          500: "#f4729c",
          600: "#e85d8a",
          700: "#c94a74",
          800: "#a63d62",
          900: "#7d2f4a",
        },
        paper: {
          DEFAULT: "#fdf8fa",
          muted: "#f6eef2",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 10px)",
        scrapbook: "1.25rem 0.85rem 1.35rem 0.9rem",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-dream": "var(--gradient-dream)",
        "gradient-blush": "var(--gradient-blush)",
        "gradient-cinematic": "var(--gradient-cinematic)",
        "noise-soft":
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35) 0%, transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,182,193,0.25) 0%, transparent 40%)",
      },
      boxShadow: {
        glass: "var(--shadow-glass)",
        lift: "0 18px 45px -18px rgba(180, 90, 120, 0.35)",
        tape: "0 2px 0 rgba(255,255,255,0.65) inset",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease forwards",
        shimmer: "shimmer 2.4s linear infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
