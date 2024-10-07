/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  content: ["./dist/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        rotate: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        rotate: "rotate 50s linear infinite",
      },
      dropShadow: {
        glow: "0 0 20px rgba(124, 25, 89, 0.7)", // Default glow
        "glow-hover": "0 0 40px rgba(124, 25, 89, 1)", // Intense hover glow
      },
    },
  },
  plugins: [],
};

