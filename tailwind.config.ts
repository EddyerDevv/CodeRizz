import type { Config } from "tailwindcss";
// @ts-ignore
import animations from "@midudev/tailwind-animations";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      geistSans: "var(--font-geist-sans)",
      inter: "var(--font-inter)",
    },
  },
  plugins: [animations],
};
export default config;
