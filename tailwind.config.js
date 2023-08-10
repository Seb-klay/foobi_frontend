/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,html}'],
  css: {
    extract: {
      filename: 'public/output.css', // Specify the desired output file path
    },
  },
  theme: {
    extend: {
      colors: {
        'app_primary_color' : '#B2A4FF',
        'app_secondary_color' : '#ABDAFC',
        'app_third_color' : '#e1f5f7'
      },
      fontFamily : {
        Alegrya : ['Alegreya Sans SC, sans-serif']
      },
      container : {
        padding : '2rem',
        center : true
      },
      screens : {
        sm : '600px',
        md : '800px'
      },
      width: {
        'icon-sm': '1rem',   // Small icon width
        'icon-md': '3rem', // Medium icon width
        // Add more custom sizes if needed
      },
      height: {
        'icon-sm': '1rem',   // Small icon height
        'icon-md': '3rem', // Medium icon height
        // Add more custom sizes if needed
      },
    },
  },
  plugins: [],
}

