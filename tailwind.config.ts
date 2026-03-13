import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        mystery: {
          dark: "#0f0f12",
          card: "#1a1a1f",
          border: "#2a2a32",
          accent: "#c9a227",
          accentDim: "#8b7219",
        },
      },
    },
  },
  plugins: [],
};

export default config;
