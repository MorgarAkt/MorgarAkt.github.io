const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./*.html",          
    "./js/**/*.js"       
  ],
  theme: {
    extend: {
      colors: {
        'background': '#1A1918',  
        'surface': '#2E2C2B',     
        'accent': '#E2DDCF',      
        'text-main': '#F0EBE7',   
        'text-muted': '#B1ABA7',  
        'project-bg': '#3A3837',  
        'project-border': '#4A4847', 
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      transitionProperty: { 
        'height': 'height',
        'spacing': 'margin, padding',
        'shadow': 'box-shadow',
        'transform': 'transform',
        'opacity': 'opacity',
        'colors': 'background-color, border-color, color, fill, stroke',
        'all': 'all',
      },
      boxShadow: { 
        'project': '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
      scale: { 
        '103': '1.03',
      },
    },
  },
  plugins: [
    plugin(function({ addComponents, theme }) {
      addComponents({
        '.btn': {
          '@apply inline-block px-5 py-2.5 rounded-md font-semibold text-base leading-tight shadow-sm': {},
          '@apply transition-colors transition-shadow duration-200 ease-in-out': {},
          '@apply focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background': {}, 
          '@apply disabled:opacity-50 disabled:cursor-not-allowed': {},
        },
        '.btn-dark': {
          '@apply bg-accent text-background border border-transparent': {}, 
          '@apply hover:bg-opacity-90 hover:shadow-md': {},
          '@apply focus:ring-accent': {}, 
          '@apply disabled:hover:bg-accent disabled:hover:shadow-sm': {}, 
        },
        '.btn-light': {
          '@apply bg-surface text-text-main border border-project-border': {}, 
          '@apply hover:bg-project-border hover:shadow-md': {}, 
          '@apply focus:ring-project-border': {}, 
          '@apply disabled:hover:bg-surface disabled:hover:shadow-sm': {}, 
        },
         '.btn-outline': {
           '@apply bg-transparent text-accent border border-accent': {},
           '@apply hover:bg-accent hover:text-background': {},
           '@apply focus:ring-accent': {},
           '@apply disabled:hover:bg-transparent disabled:hover:text-accent': {},
         },
         '.skill-tag': {
            '@apply inline-block bg-project-bg text-text-main px-3 py-1 rounded-full text-sm font-medium border border-project-border': {},
            '@apply transition-colors duration-200': {},
            '@apply hover:bg-project-border hover:text-text-main': {}
          }
      })
    })
  ],
}