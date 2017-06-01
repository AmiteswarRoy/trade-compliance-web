/* eslint max-len: 0 */
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import Profile from 'components/profile';
import mount from 'mount';

chai.use(chaiEnzyme());

describe('Profile', () => {
  let comp;
  let testCount = 0;

  const exampleUser = '{"email":"clara.coleman83@example.com","name":{"title":"ms","first":"clara","last":"coleman"},"seed":"7729a1ef4ba6ef68","picture":{"large":"http://api.randomuser.me/portraits/women/72.jpg","medium":"http://api.randomuser.me/portraits/med/women/72.jpg","thumbnail":"http://api.randomuser.me/portraits/thumb/women/72.jpg"}}';
  beforeEach(() => {
    const flux = mount(undefined, {}, true);
    if (testCount < 2) {
      flux.getActions('users').indexSuccess([ JSON.parse(exampleUser) ]);
    } else {
      flux.getActions('users').indexFail({ error: 'foobar' });
    }
    comp = mount(Profile, { params: { seed: '7729a1ef4ba6ef68' } }, flux);
    testCount += 1;
  });

  it('it should render username after request', () => {
    const { wrapper } = comp;
    expect(wrapper.find('h2')).to.have.text('Clara Coleman');
  });

  it('it should render picture after request', () => {
    const { wrapper } = comp;
    expect(wrapper.find('img')).to.have.attr(
      'src',
      'http://api.randomuser.me/portraits/med/women/72.jpg'
    );
  });

  it('it should handle errors', () => {
    const { flux } = comp;
    const { error } = flux.getStore('users').getState();
    expect(error).to.eql('foobar');
  });
});
