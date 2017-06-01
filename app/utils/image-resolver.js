import debug from 'debug';

export default (imagePath) => {
  /* istanbul ignore next */
  if (process.env.BROWSER) {
    debug('dev')('`image-resolver` should not be used in browser, something went wrong');
    throw new Error('image-resolver called on browser');
  } else if (process.env.NODE_ENV === 'test') {
    return '';
  } else {
    // Load images compiled from `webpack-stats`
    // don't cache the `webpack-stats.json` on dev
    // so we gonna read the file on each request
    let images;
    const NODE_ENV = process.env.NODE_ENV;
    if (NODE_ENV === 'development') {
      const fs = require('fs');
      const path = require('path');
      images = fs.readFileSync(path.resolve(__dirname,
                                            `../../server/webpack-stats.${NODE_ENV}.json`));
      images = JSON.parse(images).images;
    } else {
      // on production/staging, use simple `require` to cache the file
      images = require(`../../server/webpack-stats.${NODE_ENV}.json`).images;
    }

    // Find the correct image
    const regex = new RegExp(`${imagePath}$`);
    const image = images.find(img => regex.test(img.original));

    // Serve image.
    if (image) return image.compiled;

    // Serve a not-found asset maybe?
    return '';
  }
};
