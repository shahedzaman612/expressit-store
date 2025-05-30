// tailwind.config.js
module.exports = {
  darkMode: "class", // ← REQUIRED for toggle to work
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/forms"),
  ],
};
