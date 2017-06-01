/* global sinon */
import mount from 'mount';
import { expect } from 'chai';
import UserSource from 'sources/user';
import sinon from 'sinon';


describe('User-Identity Action', () => {
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

  it('setIdentity-w/accessToken,interfaceLanguage,timeZone', () => {
    const data = {
      accessToken: 'abc',
      interfaceLanguage: 'fr',
      timeZone: 'America/Los_Angeles'
    };
    userIdentityAction.setIdentity(data);
    const state = flux.getStore('userIdentity').getState();
    expect(state.identity.accessToken).to.equal(data.accessToken);
    expect(state.identity.timeZone).to.equal(data.timeZone);
    expect(state.identity.interfaceLanguage).to.equal(data.interfaceLanguage);
  });

  it('setIdentity-w/empty object', () => {
    const data = {};
    userIdentityAction.setIdentity(data);
    const state = flux.getStore('userIdentity').getState();
    expect(state.identity.accessToken).to.equal('');
    expect(state.identity.timeZone).to.equal('America/New_York');
    expect(state.identity.interfaceLanguage).to.equal('en');
  });

  it('getSuggestToken', () => {
    userIdentityAction.setSuggestToken('abc');
    const state = flux.getStore('userIdentity').getState();
    expect(state.identity.suggestToken).to.equal('abc');
    expect(state.identity.suggestTokenError).to.equal(null);
  });

  it('getSuggestToken when no token is set should return null', () => {
    userIdentityAction.setSuggestToken();
    const state = flux.getStore('userIdentity').getState();
    expect(state.identity.suggestToken).to.equal(null);
    expect(state.identity.suggestTokenError).to.equal(null);
  });

  it('setInterfaceLanguage', () => {
    userIdentityAction.setInterfaceLanguage('fr');
    const state = flux.getStore('userIdentity').getState();
    expect(state.identity.interfaceLanguage).to.equal('fr');
  });

  it('setInterfaceLanguage with no interface language should default to en', () => {
    userIdentityAction.setInterfaceLanguage();
    const state = flux.getStore('userIdentity').getState();
    expect(state.identity.interfaceLanguage).to.equal('en');
  });

  it('setInitialBreakpoint', () => {
    userIdentityAction.setInitialBreakpoint(4);
    const state = flux.getStore('userIdentity').getState();
    expect(state.identity.initialBreakpoint).to.equal(4);
  });

  it('isValid', () => {
    userIdentityAction.isValid({ accessToken: 'abc' });
  });

  it('setTimeZone', () => {
    userIdentityAction.setTimeZone({ tz: 'America/Los_Angeles' });
  });

  it('setTimeZone without passing timezone should set it to America/New_York', () => {
    userIdentityAction.setTimeZone();
    const state = flux.getStore('userIdentity').getState();
    expect(state.identity.timeZone).to.equal('America/New_York');
  });

  [ {
    name: 'Valid',
    sourceMethod: 'isValid',
    successMethod: 'isValidSuccess',
    errorMethod: 'isValidError',
    source: UserSource
  }, {
    name: 'Entitlements',
    source: UserSource
  } ].forEach((a) => {
    describe(`Get ${a.name}`, () => {
      const sourceMethod = a.sourceMethod || `get${a.name}`;
      const errorMethod = a.errorMethod || `get${a.name}Error`;
      const successMethod = a.successMethod || `get${a.name}Success`;
      const data = { accessToken: 'abc' };
      beforeEach(() => {
        sinon.stub(a.source, sourceMethod);
      });

      afterEach(() => {
        a.source[sourceMethod].restore();
      });

      context(`when ${a.name}Source.${sourceMethod} rejects on failure`, () => {
        const error = {
          code: 123456,
          message: 'An error'
        };
        beforeEach(() => {
          a.source[sourceMethod].returns(Promise.reject(error));
        });

        it(`calls action ${errorMethod} with rejected value`, async () => {
          await userIdentityAction[sourceMethod](data);
          const state = flux.getStore('userIdentity').getState();
          if (a.name === 'Entitlements') {
            expect(state.identity.entitlements).to.equal(null);
            expect(state.identity.entitlementsError).to.equal(error);
          }
          expect(state.identity.isValid).to.equal(false);
        });
      });

      context(`when ${a.name}Source.${sourceMethod} resolves data`, () => {
        const response = { name: 'company' };
        beforeEach(() => {
          a.source[sourceMethod].returns(Promise.resolve(response));
        });

        it(`calls action ${successMethod} with resolved value`, async () => {
          await userIdentityAction[sourceMethod](data);
          const state = flux.getStore('userIdentity').getState();
          if (a.name === 'Entitlements') {
            expect(state.identity.entitlements).to.equal(response);
            expect(state.identity.entitlementsError).to.equal(null);
          }
          expect(state.identity.isValid).to.equal(true);
        });
      });
    });
  });
});
