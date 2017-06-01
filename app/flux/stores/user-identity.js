import debug from 'debug';

class UserIdentityStore {

  constructor() {
    this.bindActions(this.alt.getActions('userIdentity'));
    this.identity = {
      interfaceLanguage: 'en',
      accessToken: '',
      timeZone: 'America/New_York',
      initialNow: Date.now(),
      initialBreakpoint: 16,
      entitlements: null,
      suggestToken: null,
      entitlementsError: null,
      suggestTokenError: null,
      isValid: true
    };
  }

  onSetIdentity({ accessToken, interfaceLanguage, timeZone }) {
    const identity = this.identity;
    // Save locale into a cookie
    // that will be read from server on requests
    if (accessToken) {
      debug('dev')(`updated accessToken to ${accessToken}`);
      identity.accessToken = accessToken;
    }

    if (interfaceLanguage) {
      debug('dev')(`updated interfaceLanguage to ${interfaceLanguage}`);
      identity.interfaceLanguage = interfaceLanguage;
    }

    if (timeZone) {
      debug('dev')(`updated timeZone to ${timeZone}`);
      identity.timeZone = timeZone;
    }
    this.setState({ identity });
  }

  onSetInterfaceLanguage(interfaceLanguage) {
    const identity = this.identity;
    identity.interfaceLanguage = interfaceLanguage;
    this.setState({ identity });
  }

  onSetTimeZone(timeZone) {
    const identity = this.identity;
    identity.timeZone = timeZone;
    this.setState({ identity });
  }

  onSetInitialBreakpoint(initialBreakpoint) {
    debug('dev')(`updated initialBreakpoint to ${initialBreakpoint}`);
    const identity = this.identity;
    identity.initialBreakpoint = initialBreakpoint;
    this.setState({ identity });
  }

  onGetEntitlementsSuccess(entitlements) {
    const identity = this.identity;
    identity.entitlements = entitlements;
    identity.entitlementsError = null;
    identity.isValid = true;
    this.setState({ identity });
  }

  onGetEntitlementsError(error) {
    const identity = this.identity;
    identity.entitlements = null;
    identity.entitlementsError = error;
    identity.isValid = false;
    this.setState({ identity });
  }

  onIsValidSuccess(val: bool) {
    const identity = this.identity;
    identity.isValid = val;
    this.setState({ identity });
  }

  onIsValidError(val: bool) {
    const identity = this.identity;
    identity.isValid = val;
    this.setState({ identity });
  }

  onSetSuggestToken(suggestToken) {
    const identity = this.identity;
    identity.suggestToken = suggestToken;
    identity.suggestTokenError = null;
    this.setState({ identity });
  }
}

export default UserIdentityStore;
