import oAuth from 'utils/oauth';
import debug from 'debug';
import UserSource from 'sources/user';

/* eslint-disable import/prefer-default-export */
export function validateIdentity(flux) {
  return function ({ location }, replace) {
    const { identity } = flux.getStore('userIdentity').getState();
    // if (!userIdentity.entitlements) replace(null, `/login?redirect=${pathname}`);
    if (identity && identity.accessToken && identity.interfaceLanguage) {
      UserSource.isValid(identity)
        .then(() => {
          debug('dev')('has valid identity');
        })
        .catch(() => {
          debug('dev')('has invalid identity');
          replace(null, oAuth.getAuthorizeUrl(location.origin, location.href));
          // callback();
        });
    } else {
      debug('dev')('has no identity');
      replace(null, oAuth.getAuthorizeUrl(location.origin, location.href));
    }
  };
}
