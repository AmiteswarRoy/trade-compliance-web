import proxyquire from 'proxyquire';
import chai from 'chai';
import { resolveAxios, rejectAxios } from 'axios-stub';

const should = chai.should();
proxyquire.noCallThru();

describe('Search Categories Source', () => {
  let Categories;
  const accessToken = 'token';
  const searchString = 'google';
  const maxResults = 10;

  it('should return valid response', () => {
    Categories = proxyquire('sources/auto-complete/search', {
      axios: resolveAxios
    });
    Categories.getResults({ accessToken }, { searchString, maxResults })
      .then((data) => {
        should.exist(data);
      });
  });

  it('should fail on invalid response', () => {
    Categories = proxyquire('sources/auto-complete/search', {
      axios: rejectAxios
    });
    return Categories.getResults({ accessToken }, { searchString })
      .catch((result) => {
        should.exist(result);
      });
  });
});
