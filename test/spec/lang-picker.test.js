import sinon from 'sinon';

import mount from 'mount';
import LangPicker from 'components/shared/lang-picker';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinonChai from 'sinon-chai';

chai.use(sinonChai);
chai.use(chaiEnzyme());

describe('LangPicker', () => {
  it('it should have `en` locale active', () => {
    const { wrapper } = mount(LangPicker, { activeLocale: 'en' });
    expect(wrapper.find('.active')).to.have.text('en');
  });

  it('it should call `onChange` handler with new locale', () => {
    const spy = sinon.spy();
    const { wrapper } = mount(LangPicker, { activeLocale: 'en', onChange: spy });
    expect(wrapper).to.have.exactly(2).descendants('button');

    wrapper.find('button').not('.active').simulate('click');
    expect(spy).to.have.been.calledOnce;
    expect(spy).to.have.been.calledWith('fr');
  });
});
