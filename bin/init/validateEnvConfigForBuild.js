const parseArgs = require('minimist');
const { logStatus, logSuccess, logError } = require('../consoleLogger');

const argv = parseArgs(process.argv.slice(2));

validateArguments();

function validateArguments() {
    logStatus('Validating build arguments. (required: --url=string, optional: --timeout=number)');

    const { url, timeout } = argv;
    if (!url) {
        logError('No api url specified, specify one providing a --url=string argument.');
        process.abort();
    }

    if (timeout && Number.isNaN(timeout)) {
        logError('Timeout argument should be a number.');
        process.abort();
    }

    logSuccess('Successfully validated build arguments.');
}
