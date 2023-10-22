import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      "2xl": { max: "1535px" },
      // => @media (max-width: 1535px) { ... }

      xl: { max: "1279px" },
      // => @media (max-width: 1279px) { ... }

      lg: { max: "1023px" },
      // => @media (max-width: 1023px) { ... }

      md: { max: "767px" },
      // => @media (max-width: 767px) { ... }

      sm: { max: "639px" },
      // => @media (max-width: 639px) { ... }
    },
    extend: {
      animation: {
        fadeIn: `fadeIn .8s ease`,
        fadeOut: "fadeOut .8s ease",
        sidebar: "sidebar 1s ease",
        sidebarReverse: "sidebarReverse 1s ease",
        sidebarlg: "sidebarlg .8s ease",
        sidebarReverselg: "sidebarReverselg .8s ease",
        sidebarfull: "sidebarfull .8s ease",
        sidebarReversefull: "sidebarReversefull .8s ease",
      },
      fontSize: {
        "300": "300px",
        "250": "250px",
        "200": "200px",
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

        sidebarlg: {
          "0%": { width: "0" },
          "100%": { width: "66.666667%" },
        },
        sidebarReverselg: {
          "0%": { width: "66.666667%", opacity: "1" },
          "80%": { width: "0", opacity: ".5" },
          "100%": { opacity: "0" },
        },

        sidebarfull: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        sidebarReversefull: {
          "0%": { width: "100%", opacity: "1" },
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
