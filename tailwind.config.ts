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
        "fade-in-rise": {
          "0%": { transform: "translateY(14px)" },
          "100%": { transform: "translateY(0)" },
        },
        /** „Jetzt neu“-Promo: Laptop kurz hervor, endet in Ruhelage */
        "jetzt-neu-img-lift": {
          "0%": { opacity: "0.72", transform: "scale(0.9) translateY(22px)" },
          "50%": { opacity: "1", transform: "scale(1.05) translateY(-10px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        /** Karriere-Hero: Headline leicht hoch, mit Dämpfung – endet in Ruhelage */
        "karriere-hero-in": {
          "0%": { opacity: "0", transform: "translateY(1.35rem) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        /** Stellenkarten: leichtes „Umblättern“ (3D-Y) mit Einfahren */
        "karriere-stelle-flip-in": {
          "0%": {
            opacity: "0",
            transform: "perspective(56rem) rotateY(-16deg) translateX(1.25rem)",
          },
          "100%": {
            opacity: "1",
            transform: "perspective(56rem) rotateY(0deg) translateX(0)",
          },
        },
        /** Ratgeber-Hub: Laufband durch alle Beiträge (Duplikat des Inhalts → -50 % Verschiebung) */
        "ratgeber-marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "karriere-hero-in": "karriere-hero-in 0.88s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "karriere-stelle-flip-in": "karriere-stelle-flip-in 0.72s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in-rise": "fade-in-rise 0.65s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "jetzt-neu-img-lift": "jetzt-neu-img-lift 0.95s cubic-bezier(0.22, 1, 0.36, 1) both",
        "partner-bar-fill": "partner-bar-fill 0.85s cubic-bezier(0.22, 1, 0.36, 1) both",
        "partner-col-enter": "partner-col-enter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        "partner-soft-float": "partner-soft-float 4s ease-in-out infinite",
        "partner-icon-nudge": "partner-icon-nudge 2.8s ease-in-out infinite",
        "star-pop-in": "star-pop-in 0.48s cubic-bezier(0.34, 1.45, 0.64, 1) both",
        "ratgeber-marquee": "ratgeber-marquee 70s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
