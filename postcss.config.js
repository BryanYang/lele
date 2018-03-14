module.exports = {
    plugins: [
      require('precss')({
        parser: require('postcss-scss'),
      }),
      require('postcss-px2rem')({ remUnit: 16 }),
      require('autoprefixer')({
        browsers: ['> 1% in CN', 'last 2 versions'],
      }),
      // Postcss flexbox bug fixer
      // https://github.com/luisrudge/postcss-flexbugs-fixes
      require('postcss-flexbugs-fixes')(),
    ],
  };
  