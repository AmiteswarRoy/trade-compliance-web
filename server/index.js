delete process.env.BROWSER;

// Tell `require` calls to look into `/app` also
// it will avoid `../../../../../` require strings
process.env.NODE_PATH = 'app';
require('module').Module._initPaths();

// Install `babel` hook for ES6
require('babel-core/register');

if (!global._babelPolyfill) {
  require('babel-polyfill');
}


// Install `css-modules` hook for isomorphic processing
require('css-modules-require-hook')({
  generateScopedName: '[name]--[local]---[hash:base64:5]'
});

// Load Intl polyfill
require('utils/intl-polyfill')(require('./config').locales);

// Start the server
require('./koa.js');
