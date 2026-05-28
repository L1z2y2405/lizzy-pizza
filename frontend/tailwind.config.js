/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        crust: "#f97316",
        tomato: "#dc2626",
        olive: "#1f2937",
      },
      boxShadow: {
        glow: "0 20px 80px rgba(249, 115, 22, 0.25)",
      },
    },
  },
  plugins: [],
};
