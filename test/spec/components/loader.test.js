import mount from 'mount';
import Loader from 'components/shared/loader';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

describe('Loader', () => {
  let comp;

  beforeEach(() => {
    comp = mount(Loader);
  });

  afterEach(() => {
    comp = null;
  });

  it('it should render throbber component', () => {
    const { wrapper } = comp;
    expect(wrapper.find('.comp--shared-throbber')).to.exist;
  });
});
