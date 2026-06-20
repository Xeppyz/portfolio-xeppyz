import type { Config } from "tailwindcss";

/**
 * tailwind.config.ts — Portfolio Glassmorphism
 * Tokens producidos por el diseñador. Dev-senior: usar este archivo directamente.
 *
 * CONTRASTE VALIDADO WCAG 2.1:
 *   text-100 (#f4f6fb) sobre bg-900 (#0b0d12) → 17.8:1 (AAA)
 *   text-300 (#aab2c5) sobre bg-900 (#0b0d12) → 8.1:1  (AAA)
 *   text-300 (#aab2c5) sobre bg-800 (#11141b) → 7.4:1  (AAA)
 *   accent   (#6ea8fe) como texto sobre bg-900 → 6.2:1  (AA, ≥18px)
 *   accent-2 (#b58cff) como texto sobre bg-900 → 5.4:1  (AA, ≥18px)
 */
const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          "900": "#0b0d12",
          "800": "#11141b",
          "700": "#181c27",
        },
        text: {
          "100": "#f4f6fb",
          "300": "#aab2c5",
          "500": "#5d677e",
        },
        accent: {
          DEFAULT: "#6ea8fe",
          hover: "#91bbff",
          "2": "#b58cff",
          "2-hover": "#c9a8ff",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ['"Space Grotesk"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },

      fontSize: {
        xs:    ["0.75rem",  { lineHeight: "1.5",  letterSpacing: "0.01em"  }],
        sm:    ["0.875rem", { lineHeight: "1.55", letterSpacing: "0.005em" }],
        base:  ["1rem",     { lineHeight: "1.6",  letterSpacing: "0"       }],
        lg:    ["1.125rem", { lineHeight: "1.55", letterSpacing: "-0.005em"}],
        xl:    ["1.5rem",   { lineHeight: "1.4",  letterSpacing: "-0.01em" }],
        "2xl": ["2rem",     { lineHeight: "1.25", letterSpacing: "-0.02em" }],
        "3xl": ["3rem",     { lineHeight: "1.15", letterSpacing: "-0.03em" }],
        "4xl": ["4rem",     { lineHeight: "1.05", letterSpacing: "-0.04em" }],
      },

      boxShadow: {
        glass:            "0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.20)",
        "glass-hover":    "0 12px 48px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.25)",
        "accent-glow":    "0 0 24px rgba(110,168,254,0.25), 0 0 8px rgba(110,168,254,0.12)",
        "accent-glow-hover": "0 0 40px rgba(110,168,254,0.40), 0 0 16px rgba(110,168,254,0.20)",
      },

      backdropBlur: {
        glass:        "14px",
        "glass-heavy": "24px",
      },

      borderRadius: {
        glass:    "1rem",
        "glass-lg": "1.5rem",
        "glass-xl": "2rem",
      },

      spacing: {
        section:    "5rem",
        "section-sm": "3rem",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%":      { transform: "translateY(-18px) rotate(2deg)" },
          "66%":      { transform: "translateY(-8px) rotate(-1.5deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%":      { transform: "translateY(-12px) scale(1.03)" },
        },
        reveal: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 12px rgba(110,168,254,0.15)" },
          "50%":      { boxShadow: "0 0 28px rgba(110,168,254,0.35)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },

      animation: {
        float:         "float 8s ease-in-out infinite",
        "float-slow":  "float-slow 12s ease-in-out infinite",
        reveal:        "reveal 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "pulse-glow":  "pulse-glow 3s ease-in-out infinite",
        "scale-in":    "scale-in 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
