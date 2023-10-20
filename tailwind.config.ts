import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        fadeIn: `fadeIn .8s ease`,
        fadeOut: "fadeOut .8s ease",
        sidebar: "sidebar 1s ease",
        sidebarReverse: "sidebarReverse 1s ease",
      },
      fontSize: {
        "300": "300px",
        "60": "60px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opcaity: "1" },
        },

        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },

        sidebar: {
          "0%": { width: "0" },
          "100%": { width: "41.666667%" },
        },
        sidebarReverse: {
          "0%": { width: "41.666667%", opacity: "1" },
          "80%": { width: "0", opacity: ".5" },
          "100%": { opacity: "0" },
        },
      },
      height: {
        "80": "80vh",
      },
    },
  },
  plugins: [],
};
export default config;
