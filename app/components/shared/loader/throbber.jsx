import React from 'react';
import imageResolver from 'utils/image-resolver';

let darkThrobber;
let lightThrobber;

if (process.env.BROWSER) {
  darkThrobber = require('images/DJ-throbber-dark.gif');
  lightThrobber = require('images/DJ-throbber-light.gif');
} else {
  darkThrobber = imageResolver('images/DJ-throbber-dark.gif');
  lightThrobber = imageResolver('images/DJ-throbber-light.gif');
}

function Throbber(props: { lightBackground:bool }) {
  const { lightBackground } = props;
  const src = lightBackground ? lightThrobber : darkThrobber;
  const divStyle = {
    background: `url(${src}) no-repeat center center`,
    width: '100%',
    height: '100%'
  };
  return (
    <div className='comp--shared-throbber' style={ divStyle } />
  );
}

export default Throbber;
