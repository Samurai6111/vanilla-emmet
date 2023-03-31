const styles = require('./styles.css');

module.exports = {
  plugins: [
    require('postcss-modules')({
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }),
    require('postcss-utilities')({
      center: false,
      colors: false,
      text: false,
      screens: false,
      sizing: {
        w: 'width',
        h: 'height'
      }
    }),
    require('postcss-css-variables')({
      preserve: true
    }),
    require('postcss-nested'),
    require('postcss-custom-selectors'),
    require('postcss-preset-env')({
      autoprefixer: {
        grid: true
      },
      features: {
        'nesting-rules': true
      }
    }),
    require('postcss-apply'),
    require('postcss-logical'),
    require('postcss-sorting'),
    require('postcss-discard-comments'),
    require('postcss-discard-empty'),
    require('postcss-merge-rules'),
    require('postcss-combine-media-query'),
    require('postcss-sort-media-queries'),
    require('postcss-csso')({
      forceMediaMerge: false,
      restructure: true,
      comments: false
    })
  ]
};
