// borrowed from https://github.com/gpbl/isomorphic500/blob/master/webpack%2Futils%2Fwrite-stats.js
import fs from 'fs';
import path from 'path';
import debug from 'debug';

// const filepath = path.resolve(__dirname, '../../server/webpack-stats.json');

export default function (stats, publicPath, env) {
  const json = stats.toJson();

  // get chunks by name and extensions
  const getChunks = function (name, ext = /.js$/) {
    let chunks = json.assetsByChunkName[name];

    // a chunk could be a string or an array, so make sure it is an array
    if (!(Array.isArray(chunks))) {
      chunks = [ chunks ];
    }

    return chunks
      .filter(chunk => ext.test(path.extname(chunk))) // filter by extension
      .map(chunk => `${publicPath}${chunk}`); // add public path to it
  };

  const script = getChunks('app', /js/);
  const style = getChunks('app', /css/);

  // Find compiled images in modules
  // it will be used to map original filename to the compiled one
  // for server side rendering
  const imagesRegex = /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf)(\?)?(\#[a-zA-Z0-9]+)?(\&)?(v=\d+\.\d+\.\d+)?(\#[a-zA-Z0-9]+)?/;
  const images = json.modules
    .filter(module => imagesRegex.test(module.name))
    .map(image => {
      const asset = image.assets[0];
      return {
        original: image.name,
        compiled: `${publicPath}${asset}`
      };
    });

  const content = { script, style, images };
  const file = `webpack-stats.${env}.json`;
  const filepath = path.resolve(__dirname, `../../server/${file}`);
  fs.writeFileSync(filepath, JSON.stringify(content));
  debug('dev')(`${file} updated`);
}
