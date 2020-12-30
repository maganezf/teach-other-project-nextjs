const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: true,
    content: [
      './components/**/*.tsx',
      './pages/**/*.tsx',
      './components/**/*.js',
      './pages/**/*.js',
    ],
  },
  theme: {
    fontFamily: {},
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.indigo,
        neutral: colors.gray,
      },
      fontSize: {
        12: '12px',
        14: '14px',
        16: '16px',
        18: '18px',
        20: '20px',
        24: '24px',
        30: '30px',
        36: '36px',
        48: '48px',
        60: '60px',
        80: '80px',
      },
    },
  },
  variants: {
    borderStyle: ['responsive', 'hover', 'focus'],
    transitionProperty: [
      'responsive',
      'hover',
      'focus',
      'motion-safe',
      'motion-reduce',
    ],
  },
  plugins: [],
  darkMode: 'media',
};
