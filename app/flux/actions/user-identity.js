import UserSource from 'sources/user';
import oAuth from 'utils/oauth';

let Cookies;
/* istanbul ignore next */
if (process.env.BROWSER) {
  Cookies = require('cookies-js');
}

class UserIndentiyActions {
  constructor() {
    this.generateActions(
      'setInitialBreakpoint', 'getEntitlementsSuccess', 'getEntitlementsError',
      'getSuggestTokenSuccess', 'getSuggestTokenError',
      'isValidSuccess', 'isValidError');
  }

  setIdentity({ accessToken, interfaceLanguage, timeZone }) {
    return (dispatch) => {
      /* istanbul ignore next */
      if (process.env.BROWSER) {
        const secureCookie = window.location.protocol === 'https:';
        if (accessToken) {
          Cookies.set('_accessToken', accessToken, { expires: Infinity, secure: secureCookie });
        }

        if (interfaceLanguage) {
          Cookies.set('_lang', interfaceLanguage, { expires: Infinity });
        }

        if (timeZone) {
          Cookies.set('_timeZone', timeZone, { expires: Infinity });
        }
      }
      dispatch({ accessToken, interfaceLanguage, timeZone });
    };
  }

  setInterfaceLanguage(interfaceLanguage) {
    return (dispatch) => {
      if (interfaceLanguage) {
        // Save locale into a cookie that will be read from server on requests
        /* istanbul ignore next */
        if (process.env.BROWSER) {
          Cookies.set('_lang', interfaceLanguage, { expires: Infinity });
        }
        dispatch(interfaceLanguage);
      }
    };
  }

  setSuggestToken(token) {
    return (dispatch) => {
      if (token) {
        /* istanbul ignore next */
        if (process.env.BROWSER) {
          const date = new Date();
          date.setTime(date.getTime() + (24 * 60 * 60 * 1000));
          Cookies.set('_suggestToken', token, { expires: date.toGMTString() });
        }
        dispatch(token);
      }
    };
  }

  setTimeZone(timeZone) {
    return (dispatch) => {
      if (timeZone) {
        dispatch(timeZone);
      }
    };
  }

  getEntitlements({ accessToken }) {
    return async () => {
      if (accessToken) {
        try {
          const res = await UserSource.getEntitlements({ accessToken });
          this.getEntitlementsSuccess(res);
        } catch (err) {
          this.getEntitlementsError(err);
        }
      }
    };
  }

  isValid({ accessToken }) {
    return async () => {
      if (accessToken) {
        try {
          await UserSource.isValid({ accessToken });
          this.isValidSuccess(true);
        } catch (err) {
          this.isValidError(false);
        }
      }
    };
  }

  signOut() {
    return () => {
      /* istanbul ignore next */
      if (process.env.BROWSER) {
        oAuth.signOut(Cookies.get('_accessToken'))
          .then((exitUrl) => {
            Cookies.expire('_accessToken');
            Cookies.expire('_suggestToken');
            location.href = exitUrl;
          });
      }
    };
  }
}

export default UserIndentiyActions;
