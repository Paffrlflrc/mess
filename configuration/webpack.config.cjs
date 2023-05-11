const { resolve } = require('path');

const webpack = require('webpack');

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * @type {webpack.Configuration}
 */
const config = {};

config.cache = isProduction
  ? false
  : {
      allowCollectingMemory: true,
      buildDependencies: {
        config: [__filename],
      },
      store: 'pack',
      type: 'filesystem',
    };

config.devtool = false;

config.entry = resolve(process.cwd(), './app/Index.tsx');

config.mode = isProduction ? 'production' : 'development';

config.module = {
  rules: [
    {
      test: /\.css$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            url: false,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
    {
      exclude: /node_module/,
      test: /\.jsx?$/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheCompression: isProduction,
          configFile: resolve(
            process.cwd(),
            './configuration/babel.config.cjs',
          ),
        },
      },
    },
    {
      test: /\.scss$/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            url: false,
          },
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
    {
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
          },
        },
      ],
    },
    {
      exclude: /node_modules/,
      test: /\.tsx?$/,
      use: 'ts-loader',
    },
  ],
};

config.name = 'NORMAL';

config.optimization = {
  removeAvailableModules: false,
  removeEmptyChunks: false,
  splitChunks: {
    chunks: 'all',
    hidePathInfo: true,
    name: isProduction
      ? false
      : (_module, chunks, cacheGroupKey) => {
          const { hash } = _module.buildInfo;
          const { id, name, runtime } = chunks[0];
          return `vendors/${cacheGroupKey}~${name || id || runtime}_${hash}`;
        },
    cacheGroups: {
      styleVendors: {
        enforce: true,
        name: isProduction
          ? false
          : (_module, chunks, cacheGroupKey) => {
              const { hash } = _module.buildInfo;
              const { id, name, runtime } = chunks[0];
              return `vendors/${cacheGroupKey}~${
                name || id || runtime
              }_${hash}`;
            },
        test: /\.s?css/,
        type: 'css/mini-extract',
      },
    },
  },
};

config.output = {
  filename: isProduction
    ? 'scripts/[name].[chunkhash].js'
    : 'scripts/[name].js',
  path: resolve(process.cwd(), './dist/'),
  pathinfo: false,
};

config.performance = {
  hints: false,
};

config.plugins = [
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    logLevel: 'silent',
    openAnalyzer: false,
    reportFilename: resolve(process.cwd(), './logs/webpack/stats.html'),
    reportTitle: 'Bundle',
  }),

  new CleanWebpackPlugin(),

  new CompressionWebpackPlugin({
    test: [/\.s?css$/, /\.jsx?$/],
  }),

  new FaviconsWebpackPlugin({
    cache: !isProduction,
    devMode: 'webapp',
    favicon: {
      appName: '',
      appDescription: '',
      developerName: 'Paffrlflrc',
      lang: 'en-US',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        favicons: true,
        windows: true,
        yandex: true,
      },
      shortcuts: [
        {
          name: '',
          description: '',
        },
      ],
    },
    logo: resolve(process.cwd(), './app/favicon.svg'),
    outputPath: resolve(process.cwd(), './dist/resources/icons/'),
    prefix: './resources/icons/',
  }),

  new HtmlWebpackPlugin({
    chunks: 'home',
    filename: 'index.html',
    inject: 'body',
    isProduction,
    template: resolve(process.cwd(), './app/template.html'),
  }),

  new MiniCssExtractPlugin({
    chunkFilename: isProduction
      ? 'styles/venders/[name]_[chunkhash].css'
      : 'styles/venders/[name].css',
    filename: isProduction
      ? 'styles/[name]_[chunkhash].css'
      : 'styles/[name].css',
    ignoreOrder: false,
  }),

  new webpack.AutomaticPrefetchPlugin(),

  new webpack.BannerPlugin(
    '©2023 Paffrlflrc. Some rights reserved: creativecommons.org',
  ),
];

if (!isProduction) {
  config.plugins.push(
    new webpack.SourceMapDevToolPlugin({
      filename: isProduction
        ? 'mappings/[base].[chunkhash].map'
        : 'mappings/[base].map',
    }),
  );
}

config.recordsPath = resolve(process.cwd(), './logs/webpack/records.json');

config.resolve = {
  extensions: ['.js', '.ts', '.tsx'],
  alias: {
    '@app': resolve(process.cwd(), './app'),
    '@modules': resolve(process.cwd(), './node_modules'),
    '@pages': resolve(process.cwd(), './app/pages'),
    '@themes': resolve(process.cwd(), './app/themes'),
  },
};

module.exports = config;
