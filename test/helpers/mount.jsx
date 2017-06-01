import React from 'react';
import { mount } from 'enzyme';
import { Grid } from 'react-cellblock';
import createFlux from 'flux/createFlux';
import GlobalContextContainer from 'utils/global-context-container';
import ApiClient from '../../shared/api-client';


export default (Component, props = {}, customfluxInstance) => {
  const client = new ApiClient();
  const flux = (typeof customfluxInstance === 'object') ?
    customfluxInstance : createFlux(client);

  if (customfluxInstance === true) return flux;
  const locale = props.locale ? props.locale : 'en';
  const { messages } = require(`i18n/${locale}`);

  flux
    .getActions('locale')
    .switchLocale(props.noLocale ? { locale, undefined } : { locale, messages });

  const wrapper = mount(
    <GlobalContextContainer>
      <Grid>
        <Component { ...props } />
      </Grid>
    </GlobalContextContainer>,
    { context: { flux } }
  );

  return { flux, wrapper };
};
