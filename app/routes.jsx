import React from 'react';
import { Route } from 'react-router';

import { generateRoute } from 'utils/localized-routes';
/* import { validateIdentity } from 'utils/routes-hooks'; */

export default function () { /* eslint react/display-name: 0 */
  return (
    <Route component={ require('./views/trade/') }>
      { generateRoute({
        paths: [ '/upload' ],
        component: require('./views/trade/upload')
      }) }
      { generateRoute({
        paths: [ '/', '/search' ],
        component: require('./views/trade/search')
      }) }
      <Route path='*' component={ require('./views/not-found') } />
    </Route>
  );
}
