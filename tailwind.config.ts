import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        'max-height': 'max-height'
      },
      colors: {
        "ecru": "#e6c27c",
        "papyrus": "#e5d2bc",
        "paper": "#e1e5eb",
        "bright-white": "#f6f6f6",
        "iron": "#4b5560",
        "leather": "#5c514f",
        "onyx-black": "#404041",
        "jet-black": "#303030",

        "leather-trim": "#675C5A",
        "papyrus-trim": "#CDBCA8",
        "iron-trim": "#6B7A89",
        "paper-trim": "#e1e5eb"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
