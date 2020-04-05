const fs = require('fs');
const writeFile = require('@snipsonian/node/cjs/file/writeFile').default;
const paths = require('../paths');
const { logStatus, logProgress, logSuccess, logError, log } = require('../consoleLogger');

const ENV_CONFIG_FILE_NAME = 'env-config.json';

/**
 * Keep in sync with IEnvConfig !!!
 */
const DEFAULT_ENV_CONFIG_CONTENT = `{
  "iesi_api_base_url": "",
  "iesi_api_timeout_in_seconds": 10
}`;

const configFilePath = `${paths.appSrc}/${ENV_CONFIG_FILE_NAME}`;

initEnvConfigFileIfItDoesNotExistYet();

function initEnvConfigFileIfItDoesNotExistYet() {
    logStatus('Initialisation of environment config file requested.');
    log(`env config file path: ${configFilePath}`);

    if (fs.existsSync(configFilePath)) {
        logError('The config file already exists!');
        return;
    }

    logProgress('Creating config file ...');
    writeFile({
        filePath: configFilePath,
        data: DEFAULT_ENV_CONFIG_CONTENT,
    });

    logSuccess('Config file was created successfully.');
}
