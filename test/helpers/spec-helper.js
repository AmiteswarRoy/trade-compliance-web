const path = require('path');
const hook = require('css-modules-require-hook');

require('app-module-path').addPath(__dirname);
require('app-module-path').addPath(path.join(__dirname, '..', '..', 'app'));

require('debug').enable('dev');
require('babel-polyfill');
require('babel-core/register')({
  presets: [ 'save' ]
});

hook({
  generateScopedName: '[name]--[local]'
});

require('./setup-browser-env');

var requireDirectory = require('require-directory')

var a = requireDirectory(module, '../../app', {
    extensions:['js', 'jsx'],
    exclude: /(app.settings.js|i18n|index.js|main.js)/
  })
