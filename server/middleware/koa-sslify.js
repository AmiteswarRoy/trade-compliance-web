import url from 'url';

/**
 * Default configuration
 */
const defaults = {
  trustProtoHeader: false,
  trustAzureHeader: false,
  port: 443,
  hostname: null,
  ignoreUrl: false,
  temporary: false,
  redirectMethods: [ 'GET', 'HEAD' ],
  internalRedirectMethods: [],
  excludedUrls: [ '/_health' ]
};

/**
 * Is item in array
 *   @param    {String/array/number/object}   item
 *   @param    {Array}                        array
 *   @return   {Boolean}
 *   @api      private
 */
function isInArray(item, array) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === item) { return true; }
  }
  return false;
}

/**
 * Check if method is allowed in settings
 *   @param    {String}    method
 *   @param    {Hash}      options
 *   @return   {Boolean}
 */
function isAllowed(method, settings) {
  return isInArray(method, settings.redirectMethods) ||
         isInArray(method, settings.internalRedirectMethods);
}

/**
 * enforceHTTPS
 *
 *   @param    {Hash}       options
 *   @param    {Boolean}    options[trustProtoHeader]
 *   @param    {Boolean}    options[trustAzureHeader]
 *   @param    {Integer}    options[port]
 *   @param    {String}     options[hostname]
 *   @param    {Boolean}    options[ignoreUrl]
 *   @param    {Boolean}    options[temporary]
 *   @param    {Array}      options[redirectMethods]
 *   @param    {Array}      options[internalRedirectMethods]
 *   @return   {Function}
 *   @api      public
 */

module.exports = function enforceHTTPS(options) {
  const opts = Object.assign({}, defaults, options);

  return function* (next) {
    // First, check if directly requested via https
    let secure = this.secure;

    // Second, if the request headers can be trusted (e.g. because they are send
    // by a proxy), check if x-forward-proto is set to https
    if (!secure && opts.trustProtoHeader) {
      secure = this.request.header['x-forwarded-proto'] === 'https';
    }

    // Third, if trustAzureHeader is set, check for Azure's headers
    // indicating a SSL connection
    if (!secure && opts.trustAzureHeader && this.request.header['x-arr-ssl']) {
      secure = true;
    }

    if (secure) {
      return yield next;
    }

    // Check if method should be Forbidden
    if (!isAllowed(this.method, opts)) {
      this.response.status = 403;
      return undefined;
    }

    // Check for excluded urls... This can be healthcheck url from a load-balancer
    if (opts.excludedUrls.length > 0 && opts.excludedUrls.indexOf(this.request.url) > -1) {
      return yield next;
    }

    // build redirect url
    const httpsHost = opts.hostname || url.parse(`http://${this.request.header.host}`).hostname;
    let redirectTo = `https://${httpsHost}:${opts.port}`;

    if (!opts.ignoreUrl) {
      redirectTo += this.request.url;
    }

    // Check if should internal or permanently redirect
    if (isInArray(this.method, opts.internalRedirectMethods)) {
      this.response.status = 307;
    } else if (!opts.temporary) {
      this.response.status = 301;
    }

    // redirect to secure
    return this.response.redirect(redirectTo);
  };
};
