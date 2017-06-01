import mount from 'mount';
import PageError from 'components/shared/page-error';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

chai.use(chaiEnzyme());

describe('PageError', () => {
  let comp;

  beforeEach(() => {
    comp = mount(PageError);
  });

  afterEach(() => {
    comp = null;
  });

  it('it should render error message', () => {
    const { wrapper } = comp;
    expect(wrapper.find('.comp--shared-page-error')).to.exist;
  });
});
