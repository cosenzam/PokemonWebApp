/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  corePlugins: {
    preflight: false,
  },
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        normal: '#A8A77A',
        dark: '#705746',
        fire: '#EE8130',
        water: '#6390F0',
        grass: '#7AC74C',
        electric: '#F7D02C',
        ice: '#96D9D6',
        fighting: '#C22E28', 
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        steel: '#B7B7CE',
        fairy: '#D685AD',
      }
    },
  },

  plugins: [],
}

