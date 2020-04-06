/**
 * This gets automatically registered when you start the development server.
 * https://facebook.github.io/create-react-app/docs/proxying-api-requests-in-development#configuring-the-proxy-manually
 */

/* eslint-disable import/no-extraneous-dependencies,@typescript-eslint/no-var-requires */
const { interceptGetCall } = require('./utils/env/localProxyUtils');
const envConfigLocal = require('./env-config.json');

module.exports = function configure(app) {
    interceptGetCall(app, {
        url: '/env-config.json',
        toResponse: getEnvConfigLocal,
        timeoutInMillis: 1000,
        enableIntercept: true,
    });
};

function getEnvConfigLocal(/* request */) {
    return envConfigLocal;
}
