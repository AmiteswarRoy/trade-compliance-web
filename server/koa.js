import path from 'path';
import debug from 'debug';

import Koa from 'koa';
import mount from 'koa-mount';
import helmet from 'koa-helmet';
import logger from 'koa-logger';
import favicon from 'koa-favicon';
import staticCache from 'koa-static-cache';
import responseTime from 'koa-response-time';
import userAgent from 'koa-useragent';
import Router from 'koa-router';
import convert from 'koa-convert';

import router from './router';
import config from './config';
import serverInfo from '../server/server-info';

const app = new Koa();
const env = process.env.NODE_ENV || 'development';
const ssl = process.env.SSL || 'on';

function loadProductionMiddleware() {
  app.use(convert(require('koa-conditional-get')()));
  app.use(convert(require('koa-etag')()));
  app.use(convert(require('koa-compressor')()));

  if (ssl === 'on') {
    // all other environment enforce
    const enforceHttps = require('./middleware/koa-sslify');
    // Force HTTPS on all page
    app.use(convert(enforceHttps({
      trustProtoHeader: true
    })));
  }
}

// add header `X-Response-Time`
app.use(convert(responseTime()));
app.use(convert(logger()));
app.use(convert(userAgent()));

// various security headers
app.use(helmet());

switch (env) {

case 'development':
  // set debug env, must be programmaticaly for windows
  // log when process is blocked
  require('blocked')(ms => debug('koa')(`blocked for ${ms}ms`));
  break;

case 'integration':
  // set debug env, must be programmaticaly for windows
  debug.enable('dev,koa');

  loadProductionMiddleware();
  break;

default: // staging & production
  // set debug env to `koa` only
  // must be set programmaticaly for windows
  debug.enable('koa');

  loadProductionMiddleware();
  break;
}

app.use(convert(favicon(path.join(__dirname, '../app/public/favicon.ico'))));

let cacheOpts = { maxAge: 86400000 };
app.use(convert(mount(staticCache(path.join(__dirname, '../app/public'), cacheOpts))));

cacheOpts = { maxAge: 86400000, gzip: true };

// Proxy asset folder to webpack development server in development mode
switch (env) {
case 'development': {
  const proxy = require('koa-proxy')({
    host: `http://${serverInfo.HOST}:${serverInfo.PORT}`,
    map: filePath => `assets/${filePath}`
  });
  app.use(convert(mount('/assets', proxy)));
  break;
}
default:
  app.use(
    convert(
      mount('/assets', staticCache(path.join(__dirname, `../dist_${env}`), cacheOpts))
  ));
  break;
}

// Body parser and CORS needed for API
app.use(require('koa-bodyparser')());
app.use(require('kcors')());

// mount `/api` router
const apiRouter = new Router({ prefix: '/api' });
require('./api/routes')(apiRouter);

app.use(apiRouter.routes());

// mount react-router
app.use(router);

app.listen(config.port);

// Tell parent process koa-server is started
if (process.send) process.send('online');
debug('koa')(`Application started on port ${config.port}`);
