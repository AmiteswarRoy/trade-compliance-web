import settingsProvider from 'utils/settings-provider';
import debug from 'debug';
import promisescript from 'promisescript';
import omit from 'lodash/omit';
import get from 'lodash/get';

const url = settingsProvider.get('i13N.TEALIUM_URL');
const reportSuite = settingsProvider.get('i13N.REPORT_SUITE') || 'S';
const pageSite = settingsProvider.get('i13N.PAGE_SITE');
const pageSiteProduct = settingsProvider.get('i13N.PAGE_SITE_PRODUCT');

const excludedAccounts = '9ZZZ,9ZFB,9FAC,9ANO000300'.split(',');

export default class TealiumPlugin {

  constructor(config) {
    this.config = config;
  }

  getPlugin = () => {
    /* istanbul ignore else */
    if (process.env.BROWSER) {
      return {
        name: 'Tealium',
        eventHandlers: {
          click: this.click.bind(this),
          pageview: this.pageview.bind(this)
        }
      };
    }
    /* istanbul ignore next */
    return {
      name: 'Tealium',
      eventHandlers: {
        click: () => {},
        pageview: () => {}
      }
    };
  };

  ensureScriptHasLoaded = () => {
    /* istanbul ignore else */
    if (!this.script) {
      window.utag_cfg_ovrd = window.utag_cfg_ovrd || {};
      window.utag_cfg_ovrd.noview = true;
      const pTealium =
        promisescript({
          url,
          type: 'script'
        });
      /* istanbul ignore next */
      this.script = pTealium.then(() => {
        if (typeof window === 'undefined' || !window.utag) {
          debug('dev')('unable to find utag');
          return false;
        }
        return true;
      }).catch((e) => {
        debug('dev')(`An error loading or executing Tealium has occured: ${e.message}`);
      });
    }
    return this.script;
  };

  flatten = (data, seperator = '_') => {
    const result = {};
    function recurse(cur, prop) {
      if (Object(cur) !== cur) {
        result[prop] = cur;
      } else if (Array.isArray(cur)) {
        if (cur.length) {
          cur.forEach((item, i) => (
            recurse(item, `${prop}[${i}]`)
          ));
        } else {
          result[prop] = [];
        }
      } else {
        let isEmpty = true;
        Object.keys(cur).forEach((key) => {
          /* istanbul ignore else */
          if (cur && {}.hasOwnProperty.call(cur, key)) {
            isEmpty = false;
            recurse(cur[key], prop ? prop + seperator + key : key);
          }
        });
        /* istanbul ignore next */
        if (isEmpty && prop) {
          result[prop] = {};
        }
      }
    }
    recurse(data, '');
    return result;
  };

  cleanupUtag = () => {
    /* istanbul ignore else */
    if (window.utag && window.utag.data) {
      const articleList = [
        'article_id',
        'article_access',
        'article_published',
        'article_headline',
        'article_type'
      ];
      articleList.forEach((item) => {
        delete window.utag.data[item];
      });
    }
  };

  generatePayload = (data = {}) => {
    const eid = get(data, 'identity.entitlements.userInfo.encryptedUserId');
    const language = get(data, 'identity.interfaceLanguage', 'en');
    const pageContentType = get(data, 'view.content.type');
    const pageContentSource = get(data, 'view.content.source', pageSite);
    const pageSection = get(data, 'view.section');
    const pageSubSection = get(data, 'view.subsection');
    const type = (eid) ? 'subscriber' : 'free';

    /* istanbul ignore if */
    if (!pageContentSource && !pageContentType) {
      debug('dev')('required data -> [view.content.type || view.content.source] is missing');
      return null;
    }

    let payload = Object.assign(
      {
        channel: reportSuite,
        page_site: pageSite,
        page_site_product: pageSiteProduct,
        page_content_type: pageContentType,
        page_content_source: pageContentSource,
        access_type: 'N/A',
        eid,
        language,
        user: {
          type
        }
      },
      data);

    if (pageSection) {
      payload.page_section = pageSection;
    }

    payload.page_subsection = pageSubSection;

    payload = omit(payload, [ 'identity', 'env', 'i13nNode', 'view' ]);

    const props = {};
    try {
      Object.keys(payload).forEach(key => (props[key] = payload[key]));
    } catch (e) /* istanbul ignore next */ {
      Object.keys(payload).forEach(key => (props[key] = ''));
    }

    return this.flatten(props);
  };

  isValidAccount = (accountId) => {
    if (!accountId) {
      return true;
    }

    const excluded = excludedAccounts.filter((excludedAccount) => {
      /* istanbul ignore else */
      if (excludedAccount) {
        if (accountId.indexOf(excludedAccount) > -1) {
          return false;
        }
      }
      return true;
    });
    /* istanbul ignore else */
    if (excluded.length) {
      debug('dev')(`AccountId: ${accountId} is excluded for omniture calls`);
      return true;
    }
    return false;
  };

  pageview = (payload, callback) => (
    this.ensureScriptHasLoaded().then(() => {
      this.track(payload, callback);
    })
  );

  click = (payload, callback) => (
    this.ensureScriptHasLoaded().then(() => {
      this.trackLink(payload, callback);
    })
  );

  fireCallback = (callback, resolve) => {
    /* istanbul ignore else */
    if (callback) {
      callback();
    }
    resolve();
  }

  track = (initPayload, callback) => (
    new Promise((resolve) => {
      this.cleanupUtag();
      const payload = this.generatePayload(initPayload);
      /* istanbul ignore else */
      if (payload &&
          this.isValidAccount(get(initPayload, 'identity.entitlements.userInfo.accountId'))) {
        window.utag.view(
          payload, /* istanbul ignore next */
          () => { this.fireCallback(callback, resolve); }
        );
      } else { this.fireCallback(callback, resolve); }
    })
  );

  trackLink = (payload, callback) => (
    new Promise((resolve) => {
      this.cleanupUtag();
      window.utag.link(
        this.generatePayload(payload), /* istanbul ignore next */
        () => { this.fireCallback(callback, resolve); }
      );
    })
  );
}
