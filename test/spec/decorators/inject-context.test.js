import mount from 'mount';
import MockComponent from 'component-stub';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

describe('inject-context decorator', () => {
  it('it should render correctly with no props', () => {
    const { wrapper } = mount(MockComponent);
    expect(wrapper.find('.mock-component')).to.exist;
  });

  it('it should render correctly with all props', () => {
    const props = { type: 'test', section: 'test', subsection: 'test' };
    const { wrapper } = mount(MockComponent, props);
    expect(wrapper.find('.mock-component')).to.exist;
  });
});
