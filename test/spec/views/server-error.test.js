import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import mount from 'mount';

import ServerError from 'views/server-error';

chai.use(chaiEnzyme());

describe('ServerError', () => {
  it('it should render 404 message', () => {
    const { wrapper } = mount(ServerError);
    expect(wrapper.find('h1')).to.have.text('500');
  });
});
