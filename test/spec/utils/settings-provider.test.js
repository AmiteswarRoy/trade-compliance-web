import settingsProvider from 'utils/settings-provider';
import chai from 'chai';
import sinon from 'sinon';

chai.should();

describe('Settings Provider', () => {
  before((done) => {
    sinon
      .stub(Array.prototype, 'reduce')
      .throws(new Error('mock error'));
    done();
  });
  after((done) => {
    Array.prototype.reduce.restore();
    done();
  });
  it('should throw an error if setting does not exist', async (done) => {
    (function () {
      settingsProvider.get('mock-setting');
    }).should.throw();
    done();
  });
});
