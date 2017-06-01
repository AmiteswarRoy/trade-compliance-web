const exposedProperties = [ 'window', 'navigator', 'document' ];

global.document = require('jsdom').jsdom('<body></body>');

global.window = document.defaultView;

global.Intl = require('intl');

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};
