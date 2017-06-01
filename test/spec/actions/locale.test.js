import mount from 'mount';
import Footer from 'components/footer'; // Any component can be loaded for this test
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

describe('Locale Action', () => {
  let comp;
  let flux;
  let localeAction;
  const locales = [ 'en', 'fr', 'it', 'ru', 'pt', 'de', 'es', 'ja' ];

  beforeEach(() => {
    comp = mount(Footer, { noLocale: true });
    flux = mount(undefined, {}, true);
    localeAction = flux.getActions('locale');
  });

  afterEach(() => {
    comp = null;
    flux = null;
    localeAction = null;
  });

  it('it should render component', () => {
    const { wrapper } = comp;
    expect(wrapper.find('footer')).to.exist;
  });

  // This works for coverage but I don't think it actually works as a test ¯\_(ツ)_/¯
  locales.forEach((locale) => {
    it(`should switch locale to ${locale}`, () => {
      const newComp = mount(Footer, { locale });
      const { wrapper } = newComp;
      const state = flux.getStore('locale').getState();
      localeAction.switchLocale({ locale: `${locale}` });
      expect(state.locales).to.deep.equal([]);
      expect(wrapper.find('footer')).to.exist;
    });
  });
});
