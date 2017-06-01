import mount from 'mount';
import { expect } from 'chai';

describe('Requests Action', () => {
  let requestsAction;
  let flux;
  beforeEach(() => {
    flux = mount(undefined, {}, true);
    requestsAction = flux.getActions('requests');
  });

  afterEach(() => {
    flux = null;
    requestsAction = null;
  });

  it('inProgess should be true when start action is triggered', () => {
    requestsAction.start();
    const state = flux.getStore('requests').getState();
    expect(state.inProgress).to.equal(true);
  });

  it('inProgess should be false when stop action is triggered', () => {
    requestsAction.stop();
    const state = flux.getStore('requests').getState();
    expect(state.inProgress).to.equal(false);
  });
});
