/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-to-r-semi":
          "linear-gradient(to right, rgba(255, 0, 0, 0.5), rgba(0, 0, 255, 0.5))",
      },
    },
  },
  plugins: [],
};
