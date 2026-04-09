import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        site: ["'Nunito Sans'", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "partner-bar-fill": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "partner-col-enter": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "partner-soft-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
        "partner-icon-nudge": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-4deg)" },
          "75%": { transform: "rotate(4deg)" },
        },
        "star-pop-in": {
          "0%": { opacity: "0", transform: "scale(0.35) rotate(-14deg)" },
          "70%": { transform: "scale(1.06) rotate(3deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "partner-bar-fill": "partner-bar-fill 0.85s cubic-bezier(0.22, 1, 0.36, 1) both",
        "partner-col-enter": "partner-col-enter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "partner-soft-float": "partner-soft-float 4s ease-in-out infinite",
        "partner-icon-nudge": "partner-icon-nudge 2.8s ease-in-out infinite",
        "star-pop-in": "star-pop-in 0.48s cubic-bezier(0.34, 1.45, 0.64, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
