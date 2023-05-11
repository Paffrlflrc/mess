const isProduction = process.env.NODE_ENV === 'production';

const config = {};

config.comments = !isProduction;

config.compact = isProduction;

config.minified = isProduction;

config.plugins = [];
config.plugins.push([
  '@babel/plugin-transform-runtime',
  {
    helpers: !isProduction,
  },
]);

config.presets = [];
config.presets.push([
  '@babel/preset-react',
  {
    development: !isProduction,
    runtime: 'automatic',
  },
]);

config.sourceMaps = !isProduction;

module.exports = config;
