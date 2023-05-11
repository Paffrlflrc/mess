const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const isProduction = process.env.NODE_ENV === 'production';

const config = {};

config.plugins = [autoprefixer];

if (isProduction) {
  config.plugins.push(cssnano);
}

module.exports = config;
