export default {
  content: ["./**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        growWidth: {
          "0%": { opacity: "0", width: "0%" },
          "100%": { opacity: "1", width: "100%" },
        },
      },
      animation: {
        growWidth: "growWidth 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};