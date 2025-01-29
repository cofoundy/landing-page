/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#46A0D0', // Horizonte Turquesa
          dark: '#1B577E',    // Océano Profundo
        },
        secondary: '#23435F',  // Atardecer Azul Grisáceo
        gray: {
          DEFAULT: '#848386', // Bruma Plateada
          dark: '#4B4E54',    // Carbón Urbano
        },
        dark: '#020B1B',      // Medianoche Silenciosa
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 