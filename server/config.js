const { NODE_ENV, PORT = 3000 } = process.env;

const config = {

  default: {
    port: parseInt(PORT, 10) || 3010,
    locales: [ 'en', 'fr', 'it', 'ru', 'pt', 'de', 'es', 'ja', 'zhcn', 'zhtw' ],
    env: NODE_ENV,
    excelHeaderList: [
      'Dow Jones ID',
      'Regulation ID',
      'Regulation Short Code',
      'Item code',
      'Item description',
      'Match Phrase',
      'Match Phrase Type',
      'Synonyms',
      'Region Restriction Type',
      'Region Restriction Names',
      'Region Restriction ISO-2',
      'Region Restriction Sources',
      'Additional Notes',
      'Goods Codes 1',
      'Goods Codes 2',
      'Goods Codes 3',
      'Feedback Score'
    ],
    excelRequiredHeaderListSngle: [
      'Item code',
      'Item description',
      'Match Phrase'
    ],
    excelRequiredHeaderListGroup: {
      goods_codes: []
    }
  },

  development: {
  },

  integration: {

  },

  staging: {

  },

  production: {

  }

};

export default config[NODE_ENV] ?
  { ...config.default, ...config[NODE_ENV] } :
  { ...config.default, ...config.development };
