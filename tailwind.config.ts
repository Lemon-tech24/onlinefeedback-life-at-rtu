import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      animation: {
        fadeIn: `fadeIn .8s ease`,
        fadeOut: "fadeOut .8s ease",
        sidebar: "sidebar .8s ease",
        sidebarReverse: "sidebarReverse .8s ease",
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
