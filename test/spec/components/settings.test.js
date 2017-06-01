import mount from 'mount';
import Settings from 'components/header/settings';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

describe('Header Settings', () => {
  let comp;

  beforeEach(() => {
    comp = mount(Settings, { className: 'mock' });
  });

  afterEach(() => {
    comp = null;
  });

  it('it should render header component correctly', () => {
    const { wrapper } = comp;
    wrapper.find('button').simulate('click');
    expect(wrapper.find('.mock')).to.exist;
  });
});
