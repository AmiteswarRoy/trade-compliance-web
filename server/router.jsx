import debug from 'debug';
import React from 'react';
import { renderToString } from 'react-dom/server';
import UserSource from 'sources/user';
import createFlux from 'flux/createFlux';
import includes from 'lodash/includes';
import oAuth from 'utils/oauth';

import ServerHTML from './server-html';
import ApiClient from '../shared/api-client';
import universalRender from '../shared/universal-render';
import serverInfo from '../server/server-info';

const getInitialBreakpoint = (device) => {
  debug('dev')(device);
  if (device.isMobile) {
    debug('dev')(device.isMobile);
    return 4;
  }
  if (device.isTablet) {
    return 12;
  }
  return 16;
};

export default async function (ctx) {
  // Init alt instance
  const NODE_ENV = process.env.NODE_ENV;
  const client = new ApiClient(ctx.get('cookie'));
  const flux = createFlux(client);

  // Get request locale for rendering
  const locale = ctx.cookies.get('_lang') ||
    ctx.acceptsLanguages(require('./config').locales) || 'en';

  const accessToken = ctx.cookies.get('_accessToken') || '';
  const interfaceLanguage = locale;
  const timeZone = 'America/New_York';
  const suggestToken = ctx.cookies.get('_suggestToken') || '';
  const { messages } = require(`i18n/${locale}`);
  const userAgent = ctx.request.header['user-agent'];
  const initialBreakpoint = getInitialBreakpoint(ctx.state.userAgent);

  // // added societ.io path to excluded due to browsersync
  const excludedRoutes = [ '/oauthcallback', '/_health', '/socket.io/' ];
  const excluded = includes(excludedRoutes, ctx.request.path);
  const location = ctx.request.url;

  let entitlementsResponse = null;

  if (!process.env.BROWSER) {
    global.navigator = { userAgent };
  }

  try {
    //!excluded
    if (false) {
      // check for valid accessToken
      await UserSource.getEntitlements({ accessToken, interfaceLanguage })
        .then((res) => {
          entitlementsResponse = res;
        })
        .catch((err) => {
          entitlementsResponse = err;
          return err;
        });

      debug('dev')(entitlementsResponse);
      const proceedWithRequest = (entitlementsResponse && !entitlementsResponse.code);

      debug('dev')(`proceed: ${proceedWithRequest}`);
      debug('dev')(`${ctx.request.host}`);

      if (!proceedWithRequest) {
        const protocol = ctx.request.headers['x-forwarded-proto'] || 'http';
        const port = parseInt(process.env.PORT, 10) + 2 || 3002;
        const host = NODE_ENV === 'development' ?
                     `${serverInfo.HOST}:${port}` :
                     `${ctx.request.host}`;
        const redirectUrl = `${protocol}://${host}`;

        debug('dev')(`redirectUrl: ${redirectUrl}`);
        ctx.redirect(
          oAuth.getAuthorizeUrl(redirectUrl, ctx.request.url)
        );
        return;
      }
    }else{
      const protocol = ctx.request.headers['x-forwarded-proto'] || 'http';
      const port = parseInt(process.env.PORT, 10) + 2 || 3002;
      const host = NODE_ENV === 'development' ?
                     `${serverInfo.HOST}:${port}` :
                     `${ctx.request.host}`;
      const redirectUrl = `${protocol}://${host}`;
      debug('dev')(`redirectUrl: ${redirectUrl}`);
      ctx.redirect(`${redirectUrl}/showcase`)
    }

    // Populate store with locale
    flux
      .getActions('locale')
      .switchLocale({ locale, messages });

    // Populate user-identity-store with accessToken & interfaceLanguage
    const userIdentityAction = flux.getActions('userIdentity');
    userIdentityAction.setIdentity({ accessToken, interfaceLanguage, timeZone });
    userIdentityAction.setInitialBreakpoint(initialBreakpoint);

    // if we have an entitlement response -- set it
    if (entitlementsResponse) {
      userIdentityAction.getEntitlementsSuccess(entitlementsResponse);
    }

    // if we have a suggest token - set it
    if (suggestToken) {
      userIdentityAction.getSuggestTokenSuccess(suggestToken);
    }

    debug('dev')(`locale of request: ${locale}`);

    const params = {
      flux,
      timeZone,
      interfaceLanguage,
      accessToken,
      suggestToken,
      location,
      initialBreakpoint };

    const { body, title, statusCode, description, author } =
      await universalRender(params);

    // Assets name are found into `webpack-stats`
    const assets = require(`./webpack-stats.${NODE_ENV}.json`);

    // Don't cache assets name on dev
    if (NODE_ENV === 'development') {
      delete require.cache[require.resolve(`./webpack-stats.${NODE_ENV}.json`)];
    }

    debug('dev')('return html content');
    const props = { body, assets, locale, title, description, author };
    const html = renderToString(<ServerHTML { ...props } />);
    ctx.status = statusCode;
    ctx.body = `<!DOCTYPE html>${html}`;
  } catch (err) {
    // Render 500 error page from server
    const { error, redirect } = err;
    if (error) throw error;

    // Handle component `onEnter` transition
    if (redirect) {
      const { pathname, search } = redirect;
      ctx.redirect(pathname + search);
    } else {
      throw err;
    }
  }
}
