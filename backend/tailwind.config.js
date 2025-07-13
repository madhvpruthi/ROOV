/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",              // HTML entry (Vite/CRA index)
    "./src/**/*.{js,jsx,ts,tsx}" // All component files
  ],
  theme: {
    extend: {
      fontFamily: {
        bungee: ['"Bungee"', "cursive"],
        inter: ['"Inter"', "sans-serif"],
        playfair: ['"Playfair Display"', 'serif'],
      },
      /* Optional: simple fade‑in utility */
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(0.5rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
