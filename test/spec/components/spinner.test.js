import mount from 'mount';
import Spinner from 'components/shared/spinner';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

describe('Spinner', () => {
  let comp;

  beforeEach(() => {
    comp = mount(Spinner);
  });

  afterEach(() => {
    comp = null;
  });

  it('it should render app-spinner', () => {
    const { wrapper } = comp;
    expect(wrapper.find('.app--spinner')).to.exist;
  });
});
