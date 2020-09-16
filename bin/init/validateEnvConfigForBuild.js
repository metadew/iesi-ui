const parseArgs = require('minimist');
const { logStatus, logSuccess, logError } = require('../consoleLogger');

const WINDOWS_URL_IF_NOT_FILLED_IN = '%npm_config_url%';
const WINDOWS_TIMEOUT_IF_NOT_FILLED_IN = '%npm_config_timeout%';

const argv = parseArgs(process.argv.slice(2));

validateArguments();

function validateArguments() {
    logStatus('Validating build arguments. (required: --url=string, optional: --timeout=number)');

    const { url, timeout } = argv;
    if (!url || url === WINDOWS_URL_IF_NOT_FILLED_IN) {
        logError('No api url specified, specify one providing a --url=string argument.');
        process.abort();
    }

    if ((timeout && timeout !== WINDOWS_TIMEOUT_IF_NOT_FILLED_IN) && Number.isNaN(Number(timeout))) {
        logError('Timeout argument should be a number.');
        process.abort();
    }

    logSuccess('Successfully validated build arguments.');
}
