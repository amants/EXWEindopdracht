module.exports = {
  plugins: [
    require('postcss-reporter')({ clearMessages: true }),
    require('autoprefixer')({ browsers: ['last 2 versions'] }),
  ],
};
