import debug from 'debug';

class UIStore {

  constructor() {
    this.bindActions(this.alt.getActions('ui'));
    this.bodyHeight = null;
    this.theme = {
      name: 'dark',
      size: 'normal'
    };
  }

  onUpdateProperty(data) {
    const [ property, value ] = data;
    /* istanbul ignore else */
    if (this[property] !== undefined && this[property] !== value) {
      debug('dev')(`[UIStore] - onUpdateProperty: ${property}, ${value}`);
      this.setState({ [property]: value });
    }
  }

  onSetTheme({ name, size }) {
    this.setState({ name, size });
  }
}

export default UIStore;
