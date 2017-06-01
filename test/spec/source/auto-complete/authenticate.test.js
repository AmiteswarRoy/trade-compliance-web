import proxyquire from 'proxyquire';
import chai from 'chai';
import { resolveAxios, rejectAxios } from 'axios-stub';

const should = chai.should();
proxyquire.noCallThru();

describe('Authenticate Source', () => {
  let SuggestAuthenticate;
  const accessToken = 'token';
  it('should return valid response', () => {
    SuggestAuthenticate = proxyquire('sources/auto-complete/authenticate', {
      axios: resolveAxios
    });
    return SuggestAuthenticate.getSuggestToken(accessToken)
      .then((data) => {
        should.exist(data);
      });
  });

  it('should fail on invalid response', () => {
    SuggestAuthenticate = proxyquire('sources/auto-complete/authenticate', {
      axios: rejectAxios
    });
    return SuggestAuthenticate.getSuggestToken(accessToken)
      .catch((result) => {
        should.exist(result);
      });
  });
});
