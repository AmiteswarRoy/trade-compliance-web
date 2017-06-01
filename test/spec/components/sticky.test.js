import mount from 'mount';
import MockStickyComponent from 'mock-sticky-component-stub';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

describe('Sticky ', () => {
  let comp;
  beforeEach(() => {
    comp = mount(MockStickyComponent, { noSibling: true });
  });

  afterEach(() => {
    const { wrapper } = comp;
    wrapper.unmount();
    comp = null;
  });

  it('it should render correctly if there is no sibling', (done) => {
    const { wrapper } = comp;
    expect(wrapper.find('.sticky')).to.exist;
    done();
  });
});

describe('Sticky ', () => {
  let comp;
  beforeEach(() => {
    comp = mount(MockStickyComponent, { noSibling: false });
  });

  afterEach(() => {
    const { wrapper } = comp;
    wrapper.unmount();
    comp = null;
  });

  it('it should render correctly if there is a sibling', () => {
    const { wrapper } = comp;
    expect(wrapper.find('.sticky')).to.exist;
  });
});
