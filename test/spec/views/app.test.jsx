import React from 'react';
import mount from 'mount';
import App from 'views/app';

import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

const location = { pathname: '' };

chai.use(chaiEnzyme());

describe('App', () => {
  it('it should listen for document title change', () => {
    const { flux } = mount(App, { location });
    flux.getActions('helmet').update({ title: 'foobar', titleBase: '' });
    expect(document.title).to.equal('foobar');
  });

  it('it should render logo correctly', () => {
    const { wrapper } = mount(App, { location });
    expect(wrapper.find('.header--dj-logo')).to.exist;
  });

  it('it should render header correctly', () => {
    const { wrapper } = mount(App, { location });
    expect(wrapper.find('header')).to.exist;
  });

  it('it should render children components', () => {
    const { wrapper } = mount(App, { location, children: <h1>foo</h1> });
    expect(wrapper.find('h1')).to.exist;
    expect(wrapper.find('h1')).to.have.text('foo');
  });
});
