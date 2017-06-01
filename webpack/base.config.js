import path from 'path';
import webpack from 'webpack';
import writeStats from './utils/write-stats';

const JS_REGEX = /\.js$|\.jsx$|\.es6$|\.babel$/;
const env = (!!process.env.BABEL_ENV && process.env.BABEL_ENV) ||
          (!!process.env.NODE_ENV && process.env.NODE_ENV) ||
          'development';

export default {
  devtool: 'source-map',
  env,
  entry: {
    app: './app/index.js'
  },
  output: {
    path: path.resolve(__dirname, `../dist_${env}`),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: '/assets/'
  },
  module: {
    preLoaders: [
      { test: JS_REGEX, exclude: /node_modules/, loader: 'eslint' }
    ],
    loaders: [
      { test: /\.json$/, exclude: /node_modules\/(?!moment-timezone)/, loader: 'json' },
      { test: JS_REGEX, exclude: /node_modules/, loader: 'babel' }
    ]
  },
  plugins: [
    // agrresive minimizer
    new webpack.optimize.AggressiveMergingPlugin(),
    // write webpack stats
    function () {
      this.plugin('done', (stats) => {
        writeStats(stats, this.options.output.publicPath, env);
      });
    }
  ],
  resolve: {
    extensions: [ '', '.js', '.json', '.jsx', '.es6', '.babel', '.scss', '.css' ],
    modulesDirectories: [
      'node_modules',
      'app',
      path.resolve(__dirname, './node_modules')
    ]
  },
  postcss: () => [
    require('postcss-import')({
      plugins: [ require('stylelint')() ]
    }),
    require('postcss-url')(),
    require('postcss-cssnext')({
      browsers: [ 'ie >= 8', 'last 2 versions' ],
      warnForDuplicates: false
    }),
    // add additional plugins here
    // require('postcss-browser-reporter')(),
    require('postcss-reporter')()
  ]
};
