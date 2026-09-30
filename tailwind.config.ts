import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f4f7fb",
          100: "#e6edf6",
          200: "#cbd9ec",
          300: "#9db8d9",
          400: "#6491c2",
          500: "#3d70a8",
          600: "#2d588c",
          700: "#264971",
          800: "#233e5e",
          900: "#1d3350",
          950: "#121e31",
        },
        brand: {
          50: "#eff8ff",
          100: "#dbeefe",
          200: "#bfe2fe",
          300: "#93d0fd",
          400: "#60b6fa",
          500: "#3b97f6",
          600: "#2578eb",
          700: "#1d60d8",
          800: "#1e51af",
          900: "#1e4689",
          950: "#172d54",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,.05), 0 1px 3px rgba(16,24,40,.06)",
        lift: "0 12px 32px -8px rgba(23,45,84,.16), 0 2px 6px rgba(16,24,40,.06)",
        soft: "0 4px 18px -4px rgba(23,45,84,.12)",
      },
      keyframes: {
        "pulse-soft": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: ".55" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
