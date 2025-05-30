/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Adjust if your structure is different
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/line-clamp"), // Optional plugins
    require("@tailwindcss/forms"), // Optional nice form styling
  ],
};
