module.exports = {
  plugins: {
    // --- THIS IS THE CRITICAL FIX ---
    // We are now using the correct plugin name for Tailwind CSS v4+
    '@tailwindcss/postcss': {},
    // --- END OF FIX ---
    
    autoprefixer: {},
  },
}