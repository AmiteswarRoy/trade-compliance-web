import mount from 'mount';
import Header from 'components/header';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

describe('Header', () => {
  let comp;

  beforeEach(() => {
    comp = mount(Header);
  });

  afterEach(() => {
    comp = null;
  });

  it('it should render links correctly', () => {
    const { wrapper } = comp;
    expect(wrapper.find('.app--navbar')).to.have.exactly(2).descendants('li');
  });

  it('it should render lang picker correctly', () => {
    const { wrapper } = comp;
    expect(wrapper.find('.lang--picker')).to.have.exactly(2).descendants('li');
  });

  it('it should handle requests change', () => {
    const { flux, wrapper } = comp;
    flux.getActions('requests').start();
    expect(wrapper.find('.app--spinner')).to.have.className('active');

    flux.getActions('requests').stop();
    expect(wrapper.find('.app--spinner')).to.not.have.className('active');
  });
});
