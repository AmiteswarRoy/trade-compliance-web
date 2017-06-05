import React from 'react';
import { Route } from 'react-router';

import { generateRoute } from 'utils/localized-routes';
/* import { validateIdentity } from 'utils/routes-hooks'; */

export default function () { /* eslint react/display-name: 0 */
  return (
    <Route component={ require('./views/trade/') }>
      { generateRoute({
        paths: [ '/', '/upload' ],
        component: require('./views/trade/upload')
      }) }
      { generateRoute({
        paths: [ '/search' ],
        component: require('./views/trade/search')
      }) }
      <Route path='*' component={ require('./views/not-found') } />
    </Route>
  );
  /* return (
    <Route component={ require('./views/app') }>
      { generateRoute({
        paths: [ '/search' ],
        component: require('./views/trade/search')
      }) }
      { generateRoute({
        paths: [ '/', '/users', '/utilisateurs' ],
        component: require('./components/users'),
        onEnter: validateIdentity(flux)
      }) }
      { generateRoute({
        paths: [ '/account', '/mon-compte' ],
        component: require('./views/account'),
        onEnter: validateIdentity(flux)
      }) }
      { generateRoute({
        paths: [ '/guides' ],
        component: require('./components/guides'),
        onEnter: validateIdentity(flux)
      }) }
      { generateRoute({
        paths: [ '/profile/:seed', '/profil/:seed' ],
        component: require('./components/profile'),
        onEnter: validateIdentity(flux)
      }) }
      { generateRoute({
        paths: [ '/login', '/connexion' ],
        component: require('./views/login')
      }) }
      { generateRoute({
        paths: [ '/oauthcallback' ],
        component: require('./views/oauth-callback')
      }) }
      { generateRoute({
        paths: [ '/showcase' ],
        component: require('./views/component-showcase')
      }) }
      { generateRoute({
        paths: [ '/intl' ],
        component: require('./views/intl')
      }) }
      { generateRoute({
        paths: [ '/_health' ],
        component: require('./views/health-check')
      }) }
      <Route path='*' component={ require('./views/not-found') } />
    </Route>
  ); */
}
