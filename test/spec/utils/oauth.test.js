/* eslint-disable no-unused-expressions */
import chai from 'chai';
import proxyquire from 'proxyquire';
import queryString from 'query-string';
import settingsProvider from 'utils/settings-provider';

chai.should();

describe('oAuth Util', () => {
  let oAuthUtil = proxyquire('utils/oauth',
    { jsonp: (url, opts, cb) => cb(null, url) }
  );

  const oAuthSettings = settingsProvider.get('DOW_JONES_OAUTH');
  const returnUrl = 'returnUrl';
  const state = new Buffer(JSON.stringify({ returnUrl })).toString('base64');

  it('should return the authorize url without state param', () => {
    const host = 'returnUrl';
    const url = oAuthUtil.getAuthorizeUrl(host);
    const params = queryString.parse(url.split('?')[1]);
    (params.state === undefined).should.be.true;
  });

  it('should parse the authorize callback params', () => {
    const params = oAuthUtil.parseCallbackParams(
      `#access_token=access_token&state=${state}`
      );
    params.accessToken.should.eql('access_token');
    params.state.should.be.eql({ returnUrl });
  });

  it('should parse the authorize callback params without state', () => {
    const params = oAuthUtil.parseCallbackParams('#access_token=access_token');
    params.state.should.be.empty;
  });

  it('should parse the error from auth callback', () => {
    const error = oAuthUtil.parseError({ error: 'error', error_description: 'error_description' });
    error.should.contain({
      code: 'error',
      message: 'error_description'
    });
  });

  it('should return the delegation url with required query string parameters', () => {
    const idToken = 'idToken';
    const url = oAuthUtil.getDelegationUrl(idToken);
    const params = queryString.parse(url.split('?')[1]);
    url.indexOf(`${oAuthSettings.BASE_URL}/delegation`).should.eql(0);
    params.client_id.should.be.eql(oAuthSettings.CLIENT_ID);
    params.scope.should.be.eql('openid pib');
    params.id_token.should.be.eql(idToken);
    params.grant_type.should.be.eql('urn:ietf:params:oauth:grant-type:jwt-bearer');
  });

  it('should signOut and invoke the callback with default signOut exitUrl', () =>
    oAuthUtil.signOut('access_token')
      .then((exitUrl) => {
        exitUrl.should.eql(settingsProvider.get('SIGN_OUT_EXIT_URL'));
      })
  );

  it('should signOut and invoke the callback with exitUrl from signOut response', () => {
    oAuthUtil = proxyquire('utils/oauth',
      { jsonp: (url, opts, cb) => cb(null, { exitUrl: 'signOutExitUrl' }) }
    );
    return oAuthUtil.signOut('access_token')
      .then((exitUrl) => {
        exitUrl.should.eql('signOutExitUrl');
      });
  });

  it('should return returnTo in the signOut url for V2 implementation', () => {
    const signOutUrl = oAuthUtil.getSignOutUrl('access_token');
    const params = queryString.parse(signOutUrl.split('?')[1]);
    params.token.should.be.eql('access_token');
    params.token_type_hint.should.be.eql('access_token');
    params.returnTo.should.be.eql(settingsProvider.get('SIGN_OUT_EXIT_URL'));
  });
});
