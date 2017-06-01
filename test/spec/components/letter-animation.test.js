import mount from 'mount';
import LetterDemo from 'components/shared/letter-animation';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import FlipMove from 'react-flip-move';

chai.use(chaiEnzyme());

describe('Letter Animation', () => {
  let comp;

  beforeEach(() => {
    comp = mount(LetterDemo);
  });

  afterEach(() => {
    const { wrapper } = comp;
    wrapper.unmount();
    comp = null;
  });

  it('it should render letter animation component', () => {
    const { wrapper } = comp;
    expect(wrapper.find(FlipMove)).to.exist;
  });
});
