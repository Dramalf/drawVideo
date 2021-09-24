module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      scale: {
        '120': '1.2',
        '130': '1.3',
        '140': '1.4',
        '160': '1.6',
        '170': '1.7',
        '180': '1.8',
        '190': '1.9',
        '200': '2'
      }
    },
  },
  variants: {
    extend: {
      animation: ['hover', 'focus']
    },
  },
  plugins: [],
}
