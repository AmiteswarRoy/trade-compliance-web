import debug from 'debug';

module.exports = (locales) => {
  debug('dev')(`locales:${locales}`);

  const unique = arrArg => arrArg.filter((elem, pos, arr) =>
    arr.indexOf(elem) === pos
  );

  const supportedLocales = locales.map((locale) => {
    // 'zhcn', 'zhtw'
    switch (locale.toLowerCase()) {
    case 'zhtw':
      return 'zh-Hant-TW';
    case 'zhcn':
      return 'zh-Hans-CN';
    default:
      return locale;
    }
  });

  const generalLocales = unique(locales.map((locale) => {
    // 'zhcn', 'zhtw'
    switch (locale.toLowerCase()) {
    case 'zhtw':
    case 'zhcn':
      return 'zh';
    default:
      return locale;
    }
  }));


  debug('dev')(`supportedLocales:${supportedLocales}`);
  if (!process.env.BROWSER) {
    if (global.Intl) {
      const areIntlLocalesSupported = require('intl-locales-supported');
      // Determine if the built-in `Intl` has the locale data we need.
      if (!areIntlLocalesSupported(supportedLocales)) {
        debug('dev')('polyfilling -- found unsupported locales');

        // `Intl` exists, but it doesn't have the data we need, so load the
        // polyfill and patch the constructors we need with the polyfill's.
        const IntlPolyfill = require('intl');
        Intl.NumberFormat = IntlPolyfill.NumberFormat;
        Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

        // This is a test for bug associated with intl and should be fixed in
        // version 1.3.x ...
        // debug('dev')(new IntlPolyfill.DateTimeFormat('en', {
        //   month: '2-digit'
        // }).format(Date.now()));
        //
        for (const locale of supportedLocales) {
          require(`intl/locale-data/jsonp/${locale}.js`);
        }

        const { addLocaleData } = require('react-intl');
        for (const locale of generalLocales) {
          addLocaleData(require(`react-intl/locale-data/${locale}.js`));
        }
      }
    } else {
      // No `Intl`: use and load polyfill
      global.Intl = require('intl');
      debug('koa')('Intl is not supported, so the polyfill has been loaded');
    }
  }
};
