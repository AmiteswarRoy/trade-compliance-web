import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import mount from 'mount';

import NotFound from 'views/not-found';

chai.use(chaiEnzyme());

describe('NotFound', () => {
  it('it should render 404 message', () => {
    const { wrapper } = mount(NotFound);
    expect(wrapper.find('h1')).to.have.text('404');
  });
});
