const path = require('path');

const SRC = path.resolve(__dirname, 'src');
const TESTS = path.resolve(SRC, 'test');

// Para los tests: Babel normal
const babelLoader = { loader: 'babel-loader' };

// Para el código de la app: Babel + plugin que mide la cobertura
const babelConCobertura = {
  loader: 'babel-loader',
  options: { plugins: ['istanbul'] },
};

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-jasmine-html-reporter'),
    ],

    files: [{ pattern: 'src/test/context.js', watched: false }],
    preprocessors: { 'src/test/context.js': ['webpack'] },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            include: SRC,
            exclude: TESTS,
            type: 'javascript/auto',
            resolve: { fullySpecified: false },
            use: [babelConCobertura],
          },
          {
            test: /\.jsx?$/,
            include: TESTS,
            type: 'javascript/auto',
            resolve: { fullySpecified: false },
            use: [babelLoader],
          },
          { test: /\.css$/, use: ['style-loader', 'css-loader'] },
          { test: /\.(webp|png|jpe?g|gif|svg)$/i, type: 'asset/inline' },
        ],
      },
    },

    reporters: ['progress', 'kjhtml', 'coverage'],
    coverageReporter: {
      dir: path.resolve(__dirname, 'coverage'),
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' },
        { type: 'text' },
        { type: 'json-summary', subdir: '.', file: 'coverage-summary.json' },
      ],
    },

    client: { jasmine: { random: true }, clearContext: false },

    browsers: ['ChromeHeadlessSinSandbox'],
    customLaunchers: {
      ChromeHeadlessSinSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-gpu'],
      },
    },

    browserNoActivityTimeout: 60000,
    singleRun: true,
    restartOnFileChange: true,
  });
};