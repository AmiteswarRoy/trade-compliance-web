import debug from 'debug';

// Browser ES6 Polyfill
if (!global._babelPolyfill) {
  debug('dev')('Adding babel-polyfill');
  require('babel-polyfill');
}

const { NODE_ENV } = process.env;
if (NODE_ENV !== 'production') {
  debug.enable('dev,koa');
}

// Start application
require('./main');
