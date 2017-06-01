import { validateIdentity } from 'utils/routes-hooks';
import mount from 'mount';
import { expect } from 'chai';
import sinon from 'sinon';
import UserSource from 'sources/user';

describe('ValidateIdentity', () => {
  let userIdentityAction;
  let flux;
  beforeEach(() => {
    flux = mount(undefined, {}, true);
    userIdentityAction = flux.getActions('userIdentity');
  });

  afterEach(() => {
    flux = null;
    userIdentityAction = null;
  });

  it('with valid identity should execute', (done) => {
    const data = {
      accessToken: 'abc',
      interfaceLanguage: 'fr',
      timeZone: 'America/Los_Angeles'
    };
    userIdentityAction.setIdentity(data);
    expect(validateIdentity(flux)).to.be.a.function;
    done();
  });
});

describe('ValidateIdentity', () => {
  let userIdentityAction;
  let flux;
  const method = sinon.spy();

  beforeEach(() => {
    flux = mount(undefined, {}, true);
    userIdentityAction = flux.getActions('userIdentity');
  });

  afterEach(() => {
    flux = null;
    userIdentityAction = null;
  });

  it('without valid identity should execute', () => {
    const data = {
      interfaceLanguage: 'fr',
      timeZone: 'America/Los_Angeles'
    };
    userIdentityAction.setIdentity(data);
    expect(validateIdentity(flux)).to.be.a.function;
    validateIdentity(flux)({ location: { origin: 'origin', href: 'href' } }, method);
    expect(method).to.have.been.called;
  });
});

describe('ValidateIdentity', () => {
  let userIdentityAction;
  let flux;
  const method = sinon.spy();

  beforeEach(() => {
    flux = mount(undefined, {}, true);
    userIdentityAction = flux.getActions('userIdentity');
    sinon
      .stub(UserSource, 'isValid')
      .returns(Promise.reject(new Error()));
  });

  afterEach(() => {
    flux = null;
    userIdentityAction = null;
    UserSource.isValid.restore();
  });

  it('when user source is not valid should execute', () => {
    const data = {
      accessToken: 'abc',
      interfaceLanguage: 'fr',
      timeZone: 'America/Los_Angeles'
    };
    userIdentityAction.setIdentity(data);
    expect(validateIdentity(flux)).to.be.a.function;
    validateIdentity(flux)({ location: { origin: 'origin', href: 'href' } }, method);
    expect(method).to.not.have.been.called;
  });
});

describe('ValidateIdentity', () => {
  let userIdentityAction;
  let flux;
  const method = sinon.spy();

  beforeEach(() => {
    flux = mount(undefined, {}, true);
    userIdentityAction = flux.getActions('userIdentity');
    sinon
      .stub(UserSource, 'isValid')
      .returns(Promise.resolve(true));
  });

  afterEach(() => {
    flux = null;
    userIdentityAction = null;
    UserSource.isValid.restore();
  });

  it('when user source is valid should execute', () => {
    const data = {
      accessToken: 'abc',
      interfaceLanguage: 'fr',
      timeZone: 'America/Los_Angeles'
    };
    userIdentityAction.setIdentity(data);
    expect(validateIdentity(flux)).to.be.a.function;
    validateIdentity(flux)({ location: { origin: 'origin', href: 'href' } }, method);
    expect(method).to.not.have.been.called;
  });
});
