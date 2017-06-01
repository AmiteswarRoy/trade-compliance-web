const { NODE_ENV, PORT = 3000 } = process.env;

const config = {

  default: {
    port: parseInt(PORT, 10) || 3010,
    locales: [ 'en', 'fr', 'it', 'ru', 'pt', 'de', 'es', 'ja', 'zhcn', 'zhtw' ],
    env: NODE_ENV
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
