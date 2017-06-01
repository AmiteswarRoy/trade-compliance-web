import webpack from 'webpack';
import baseConfig from './base.config';
import startKoa from './utils/start-koa';
import serverInfo from '../server/server-info';


const PUBLIC_PATH = `//${serverInfo.HOST}:${serverInfo.PORT}/assets/`;

export default {
  server: {
    port: serverInfo.PORT,
    options: {
      publicPath: PUBLIC_PATH,
      hot: true,
      stats: {
        assets: true,
        colors: true,
        version: false,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false
      }
    }
  },
  webpack: {
    ...baseConfig,
    entry: {
      app: [
        `webpack-hot-middleware/client?path=//${serverInfo.HOST}:${serverInfo.PORT}/__webpack_hmr`,
        './app/index.js'
      ]
    },
    output: { ...baseConfig.output, publicPath: PUBLIC_PATH },
    module: {
      ...baseConfig.module,
      loaders: [
        ...baseConfig.module.loaders,
        {
          test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)(\?v=[0-9].[0-9].[0-9])?$/,
          loader: 'file?name=[sha512:hash:base64:7].[ext]',
          exclude: /node_modules\/(?!font-awesome)/
        },
        {
          test: /\.global\.css$/,
          loader: 'style!css?importLoaders=1!postcss?outputStyle=expanded&sourceMap',
          exclude: /node_modules/
        },
        {
          test: /^((?!\.global).)*\.css$/,
          loader: 'style!css?modules&importLoaders=1&localIdentName=[name]--[local]---[hash:base64:5]!postcss?outputStyle=expanded&sourceMap',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      // hot reload
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),

      new webpack.DefinePlugin({
        'process.env': {
          BROWSER: JSON.stringify(true),
          NODE_ENV: JSON.stringify('development')
        }
      }),

      new webpack.optimize.DedupePlugin(),

      ...baseConfig.plugins,

      function () { this.plugin('done', startKoa); }
    ]
  }
};
