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
        "dog-run": {
          "0%": { transform: "translateX(-20px) scaleX(1)" },
          "50%": { transform: "translateX(160px) scaleX(1)" },
          "51%": { transform: "translateX(160px) scaleX(-1)" },
          "100%": { transform: "translateX(-20px) scaleX(-1)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "dog-run": "dog-run 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
