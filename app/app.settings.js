import merge from 'lodash/merge';

const { NODE_ENV } = process.env;
const settings = {

  default: {
    NODE_ENV,

    NEW_RELIC: {
      ENABLED: true,
      LICENSE_KEY: '7507ee8e10',
      APPLICATION_ID: '15967387'
    },

    HELMET: {
      AUTHOR: 'Dow Jones PIB Development',
      TITLE_BASE: 'Universal ReactJS ES7 Boilerplate',
      DESCRIPTION: 'Universal ReactJS ES7 Boilerplate, source code on github.dowjones.com'
    },

    i13N: {
      ENABLED: false,
      TEALIUM_URL: 'https://tags.tiqcdn.com/utag/wsjdn/venturesource/prod/utag.js',
      REPORT_SUITE: '$$report_suite_name$$',
      PAGE_SITE: '$$PAGE_SITE$$',
      PAGE_SITE_PRODUCT: '$$PAGE_SITE_PRODUCT$$'
    },

    GENERAL: {
      TIME_OUT: 30000,
      DATE_FORMAT: 'DD MMM YYYY'
    },

    DOW_JONES_OAUTH: {
      V1_BASE_URL: 'https://staging.dev.factiva.com/oauth/v1',
      V1_CLIENT_ID: 'NkmhsTuutynPUItbVADlvpfr',
      BASE_URL: 'https://ssoten1.int.accounts.dowjones.com',
      SIGN_OUT_BASE_URL: 'https://int.accounts.dowjones.com',
      CLIENT_ID: 'VOmjshYbwWpieoAlOKUGqvy5CsSWhUSZ',
      PRODUCT_NAME: 'djvs',
      AUTHORIZE_SCOPE: 'openid first_name last_name email',
      RESPONSE_TYPE: 'token',
      CONNECTION: 'dj-oauth',
      DELEGATION_SCOPE: 'openid pib',
      GRANT_TYPE: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
    },

    ENABLE_AUTH0_V2: true,

    SIGN_OUT_EXIT_URL: 'http://www.dowjones.com'
  },

  development: {
    i13N: {
      TEALIUM_URL: 'https://tags.tiqcdn.com/utag/wsjdn/venturesource/dev/utag.js'
    },

    DOW_JONES_PIB: {
      API_3_0_BASE_URL: 'https://api.stg.dowjones.com/api/3.0',
      API_2_0_PUBLIC_URL: 'https://api.stg.dowjones.com/api/public/2.0',
      API_2_0_PRIVATE_URL: 'https://api.stg.dowjones.com/api/private/2.0',
      API_BASE_URL: 'https://api.stg.dowjones.com',
      AUTO_COMPLETE_BASE_URL: 'https://suggest.stg.dowjones.com',
      USER_SNAP: {
        URL: 'https://api.usersnap.com/load/2f13a347-b945-4fc2-90fd-e2fb59d22e18.js',
        ENABLED: true
      }
    }
  },

  integration: {
    i13N: {
      TEALIUM_URL: 'https://tags.tiqcdn.com/utag/wsjdn/venturesource/dev/utag.js'
    },

    DOW_JONES_PIB: {
      API_3_0_BASE_URL: 'https://api.stg.dowjones.com/api/3.0',
      API_2_0_PUBLIC_URL: 'https://api.stg.dowjones.com/api/public/2.0',
      API_2_0_PRIVATE_URL: 'https://api.stg.dowjones.com/api/private/2.0',
      API_BASE_URL: 'https://api.stg.dowjones.com',
      AUTO_COMPLETE_BASE_URL: 'https://suggest.stg.dowjones.com',
      USER_SNAP: {
        URL: 'https://api.usersnap.com/load/2f13a347-b945-4fc2-90fd-e2fb59d22e18.js',
        ENABLED: true
      }
    }
  },

  staging: {
    i13N: {
      TEALIUM_URL: 'https://tags.tiqcdn.com/utag/wsjdn/venturesource/qa/utag.js'
    },

    DOW_JONES_PIB: {
      API_3_0_BASE_URL: 'https://api.stg.dowjones.com/api/3.0',
      API_2_0_PUBLIC_URL: 'https://api.stg.dowjones.com/api/public/2.0',
      API_2_0_PRIVATE_URL: 'https://api.stg.dowjones.com/api/private/2.0',
      API_BASE_URL: 'https://api.stg.dowjones.com',
      AUTO_COMPLETE_BASE_URL: 'https://suggest.stg.dowjones.com',
      USER_SNAP: {
        URL: 'https://api.usersnap.com/load/2f13a347-b945-4fc2-90fd-e2fb59d22e18.js',
        ENABLED: false
      }
    },

    DOW_JONES_OAUTH: {
      BASE_URL: 'https://djlogin.stg.dowjones.com/oauth/v1'
    }
  },

  production: {
    i13N: {
      TEALIUM_URL: 'https://tags.tiqcdn.com/utag/wsjdn/venturesource/prod/utag.js'
    },

    DOW_JONES_PIB: {
      API_3_0_BASE_URL: 'https://api.dowjones.com/api/3.0',
      API_2_0_PUBLIC_URL: 'https://api.dowjones.com/api/public/2.0',
      API_2_0_PRIVATE_URL: 'https://api.dowjones.com/api/private/2.0',
      API_BASE_URL: 'https://api.dowjones.com',
      AUTO_COMPLETE_BASE_URL: 'https://suggest.dowjones.com',
      USER_SNAP: {
        URL: 'https://api.usersnap.com/load/2f13a347-b945-4fc2-90fd-e2fb59d22e18.js',
        ENABLED: false
      }
    },

    DOW_JONES_OAUTH: {
      BASE_URL: 'https://djlogin.dowjones.com/oauth/v1',
      CLIENT_ID: 'NRGuVfsTitWxsbGkJRNvCTMV'
    }
  }

};
const output = settings[NODE_ENV] ?
  merge(settings.default, settings[NODE_ENV]) :
  merge(settings.default, settings.development);

export default output;
