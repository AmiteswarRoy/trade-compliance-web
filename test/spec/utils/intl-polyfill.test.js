import intlPolyFill from 'utils/intl-polyfill';
import chai, { expect } from 'chai';

const cEnv = process.env.BROWSER;

chai.should();

describe('IntlPolyFill', () => {
  before(() => {
    process.env.BROWSER = 'exists';
  });

  after(() => {
    if (cEnv) {
      process.env.BROWSER = cEnv;
    } else {
      delete process.env.BROWSER;
    }
  });

  it('should load with polyfill with Browser environment variable set', () => {
    intlPolyFill([ 'en', 'fr', 'it', 'ru', 'pt', 'de', 'es', 'ja', 'zh-cn', 'zh-tw' ]);
    expect(Intl).to.exist;
  });
});

describe('IntlPolyFill', () => {
  it('should load with polyfill without Browser environment variable set', () => {
    intlPolyFill([ 'en' ]);
    expect(Intl).to.exist;
  });
});


describe('IntlPolyFill', () => {
  const globalIntl = global.Intl;

  before(() => {
    global.Intl = undefined;
  });

  after(() => {
    global.Intl = globalIntl;
  });

  it('should load with polyfill without Browser environment variable set', () => {
    intlPolyFill([ 'en', 'fr', 'it', 'ru', 'pt', 'de', 'es', 'ja', 'zh-cn', 'zh-tw' ]);
    expect(Intl).to.exist;
  });
});

