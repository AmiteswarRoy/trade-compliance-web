import proxyquire from 'proxyquire';
import chai, { expect } from 'chai';
import { resolveAxios, resolveAxiosWithNoData } from 'axios-stub';
import helper from 'sources/utils/api/v3/helper';

chai.should();
proxyquire.noCallThru();

describe('User Source', () => {
  let auth;
  let user;
  beforeEach(() => {
    auth = { accessToken: 'token' };
    user = proxyquire('sources/user', {
      axios: resolveAxios
    });
  });

  it('should return valid response for getEntitlements', () =>
    user.getEntitlements(auth).then((data) => {
      data.method.should.equal('get');
    })
  );

  it('should return valid response for isValid', () =>
    user.isValid(auth).then((data) => {
      data.method.should.equal('get');
    })
  );
});

describe('User Source', () => {
  let auth;
  let user;
  beforeEach(() => {
    auth = { accessToken: 'token' };
    user = proxyquire('sources/user', {
      axios: resolveAxiosWithNoData
    });
  });

  it('should return undefined for getEntitlements if request returns an empty response', () =>
      user.getEntitlements(auth).then((data) => {
        expect(data).to.be.undefined;
      })
  );
});

describe('User Source', () => {
  const resp = helper.normalize({ data: [] }, '', false);
  expect(resp).to.not.be.undefined;
});
