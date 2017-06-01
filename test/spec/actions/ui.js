import mount from 'mount';
import { expect } from 'chai';

describe('Requests Action', () => {
  let uiAction;
  let flux;
  beforeEach(() => {
    flux = mount(undefined, {}, true);
    uiAction = flux.getActions('ui');
  });

  afterEach(() => {
    flux = null;
    uiAction = null;
  });

  it('updateProperty should be 100 when start action updateProperty', () => {
    uiAction.start();
    this.getActions('ui').updateProperty('bodyHeight', 100);
    const state = flux.getStore('ui').getState();
    expect(state.bodyHeight).to.equal(100);
  });

  it('updateProperty should be 100 when start action updateProperty', () => {
    uiAction.start();
    const data = { name: 'test', size: 'large' };
    this.getActions('ui').setTheme(data);
    const state = flux.getStore('ui').getState();
    expect(state.theme).to.equal(data);
  });
});
