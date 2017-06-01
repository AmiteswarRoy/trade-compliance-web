import mount from 'mount';
import MockComponent from 'component-stub';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

describe('enable intl decorator', () => {
  let comp;
  beforeEach(() => {
    comp = mount(MockComponent);
  });

  afterEach(() => {
    comp = null;
  });

  it('it should render correctly', () => {
    const { wrapper } = comp;
    expect(wrapper.find('.mock-component')).to.exist;
  });
});
