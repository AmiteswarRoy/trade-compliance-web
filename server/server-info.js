import { isArray } from 'lodash';

const { VIRTUAL_HOST, C9_HOSTNAME } = process.env;
const LOCAL_IP = require('dev-ip')();

const PORT = parseInt(process.env.PORT, 10) + 1 || 3001;
const HOST = VIRTUAL_HOST ||
  (isArray(LOCAL_IP) && LOCAL_IP[0]) ||
  LOCAL_IP ||
  'localhost';

export default {
  C9_HOSTNAME, LOCAL_IP, PORT, HOST
};
