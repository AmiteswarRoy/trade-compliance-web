const loaders = {
  en: async () => {
    if (!window.Intl) {
      await require('promise?global!intl')();
      await require('promise?global!intl/locale-data/jsonp/en.js')();
    }
    await require('promise?global!moment')();
    // await require('promise?global!moment/locale/en'); not required
    await require('promise?global!moment-timezone')();
    return await require('promise?global!i18n/en')();
  },

  fr: async () => {
    if (!window.Intl) {
      await require('promise?global!intl')();
      await require('promise?global!intl/locale-data/jsonp/fr.js')();
    }
    await require('promise?global!moment')();
    await require('promise?global!moment/locale/fr')();
    await require('promise?global!moment-timezone')();
    return await require('promise?global!i18n/fr')();
  },

  es: async () => {
    if (!window.Intl) {
      await require('promise?global!intl')();
      await require('promise?global!intl/locale-data/jsonp/es.js')();
    }
    await require('promise?global!moment')();
    await require('promise?global!moment/locale/es')();
    await require('promise?global!moment-timezone')();
    return await require('promise?global!i18n/es')();
  },

  it: async () => {
    if (!window.Intl) {
      await require('promise?global!intl')();
      await require('promise?global!intl/locale-data/jsonp/it.js')();
    }
    await require('promise?global!moment')();
    await require('promise?global!moment/locale/it')();
    await require('promise?global!moment-timezone')();
    return await require('promise?global!i18n/it')();
  },

  de: async () => {
    if (!window.Intl) {
      await require('promise?global!intl')();
      await require('promise?global!intl/locale-data/jsonp/de.js')();
    }
    await require('promise?global!moment')();
    await require('promise?global!moment/locale/de')();
    await require('promise?global!moment-timezone')();
    return await require('promise?global!i18n/de')();
  },

  pt: async () => {
    if (!window.Intl) {
      await require('promise?global!intl')();
      await require('promise?global!intl/locale-data/jsonp/pt.js')();
    }
    await require('promise?global!moment')();
    await require('promise?global!moment/locale/pt')();
    await require('promise?global!moment-timezone')();
    return await require('promise?global!i18n/pt')();
  },

  ja: async () => {
    if (!window.Intl) {
      await require('promise?global!intl')();
      await require('promise?global!intl/locale-data/jsonp/ja.js')();
    }
    await require('promise?global!moment')();
    await require('promise?global!moment/locale/ja')();
    await require('promise?global!moment-timezone')();
    return await require('promise?global!i18n/ja')();
  },

  ru: async () => {
    if (!window.Intl) {
      await require('promise?global!intl')();
      await require('promise?global!intl/locale-data/jsonp/ru.js')();
    }
    await require('promise?global!moment')();
    await require('promise?global!moment/locale/ru')();
    await require('promise?global!moment-timezone')();
    return await require('promise?global!i18n/ru')();
  },

  zhcn: async () => {
    if (!window.Intl) {
      await require('promise?global!intl')();
      await require('promise?global!intl/locale-data/jsonp/zh-Hans-CN.js')();
    }
    await require('promise?global!moment')();
    await require('promise?global!moment/locale/zh-cn')();
    await require('promise?global!moment-timezone')();
    return await require('promise?global!i18n/zh-Hans-CN')();
  },

  zhtw: async () => {
    if (!window.Intl) {
      await require('promise?global!intl')();
      await require('promise?global!intl/locale-data/jsonp/zh-Hant-TW.js')();
    }
    await require('promise?global!moment')();
    await require('promise?global!moment/locale/zh-tw')();
    await require('promise?global!moment-timezone')();
    return await require('promise?global!i18n/zh-Hant-TW')();
  }
};

export default async (locale) => {
  const result = await loaders[locale]();
  /* istanbul ignore next */
  if (process.env.BROWSER) {
    // window.ReactIntl = require('react-intl');
    // if (locale === 'zhtw' || locale === 'zhcn') {
    //   require('react-intl/dist/locale-data/zh.js');
    // } else {
    //   require(`react-intl/dist/locale-data/${locale}.js`);
    // }
    const { addLocaleData } = require('react-intl');

    switch (locale) {
    case 'zhtw':
    case 'zhcn':
      addLocaleData(require('react-intl/locale-data/zh.js'));
      break;
    default:
      addLocaleData(require(`react-intl/locale-data/${locale}.js`));
      break;
    }
  }

  return result;
};
