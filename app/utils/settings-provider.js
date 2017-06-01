import settings from 'app.settings';

export default {
  get(path) {
    const pathParts = path.split('.');
    let setting;
    try {
      setting = pathParts.reduce((obj, pathPart) => obj[pathPart], settings);
    } catch (e) {
      if (setting === undefined) {
        throw new ReferenceError(`Could not find setting: ${path}: ${e}`);
      }
    }
    return setting;
  }
};
