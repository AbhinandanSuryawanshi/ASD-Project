/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F5A5C",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#E6F2F2",
          foreground: "#0F5A5C",
        },
        accent: {
          DEFAULT: "#EE6C4D",
          foreground: "#FFFFFF",
        },
        background: {
          DEFAULT: "#FAFAF9",
          paper: "#FFFFFF",
        },
        text: {
          primary: "#1C1917",
          secondary: "#57534E",
          muted: "#A8A29E",
        },
        border: "#E7E5E4",
        input: "#F5F5F4",
        ring: "#0F5A5C",
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.04)",
        hover: "0 8px 24px rgba(15,90,92,0.08)",
        button: "0 4px 12px rgba(238,108,77,0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
