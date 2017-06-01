import debug from 'debug';
// Paths are relative to `app` directory
import createFlux from 'flux/createFlux';

import ApiClient from '../shared/api-client';
import universalRender from '../shared/universal-render';

const client = new ApiClient();
const flux = createFlux(client);

universalRender({ flux }).catch(err => debug('dev')(err));
