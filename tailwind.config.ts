import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-navy": "var(--color-dark-navy)",
        "primary-blue": "var(--color-primary-blue)",
        "electric-yellow": "var(--color-electric-yellow)",
        "off-white": "var(--color-off-white)",
        "dark-text": "var(--color-dark-text)",
        "light-border": "var(--color-light-border)",
      },
    },
  },
  plugins: [],
} satisfies Config;
