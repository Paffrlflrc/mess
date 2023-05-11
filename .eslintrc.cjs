const config = {};

config.env = {
  browser: true,
  es2021: true,
  node: true,
};

config.extends = [
  'airbnb',
  'airbnb/hooks',
  'plugin:import/recommended',
  'plugin:node/recommended',
  'plugin:promise/recommended',
  'plugin:react/recommended',
  'prettier',

  // Make sure this is last.
  'plugin:prettier/recommended',
];

config.parserOptions = {
  ecmaFeatures: { jsx: true },
  ecmaVersion: 'latest',
  sourceType: 'module',
};

config.plugins = ['html', 'node', 'react', 'prettier', 'promise'];

config.root = true;

config.rules = {
  'import/extensions': ['off'],
  'import/no-extraneous-dependencies': ['off'],
  'no-nested-ternary': ['off'],
  'no-param-reassign': ['error', { props: false }],
  'node/no-missing-import': ['off'],
  'promise/always-return': ['off'],
  'react-hooks/exhaustive-deps': ['off'],
  'react/display-name': ['off'],
  'react/destructuring-assignment': ['off'],
  'react/jsx-props-no-spreading': ['off'],
  'react/no-unused-prop-types': ['warn'],
};

config.settings = {
  react: {
    version: 'detect',
  },
};

config.overrides = [
  {
    files: ['*.ts', '*.tsx'],

    extends: [
      'airbnb-typescript',
      // "plugin:@typescript-eslint/recommended-requiring-type-checking",
      'plugin:@typescript-eslint/recommended',
    ],

    parser: '@typescript-eslint/parser',

    parserOptions: {
      project: ['./tsconfig.json'],
      tsconfigRootDir: './',
    },

    plugins: ['eslint-plugin-tsdoc'],

    rules: {
      '@typescript-eslint/indent': ['off'],
      '@typescript-eslint/no-unused-vars': ['warn'],
      'import/extensions': ['off'],
      'import/no-extraneous-dependencies': ['off'],
      'no-unused-vars': ['off'],
      'react/jsx-props-no-spreading': ['off'],
      'react/prop-types': ['off'],
      'react/require-default-props': ['off'],
    },
  },
];

module.exports = config;
