const fs = require('fs');
const parseArgs = require('minimist');
const writeFile = require('@snipsonian/node/cjs/file/writeFile').default;
const paths = require('../paths');
const { logStatus, logProgress, logSuccess, logError, log } = require('../consoleLogger');

const ENV_CONFIG_FILE_NAME = 'env-config.json';

const argv = parseArgs(process.argv.slice(2));

const configFilePath = `${paths.appBuild}/${ENV_CONFIG_FILE_NAME}`;

initEnvConfigFileIfItDoesNotExistYet();

function initEnvConfigFileIfItDoesNotExistYet() {
    logStatus('Initialisation of environment config file requested.');
    log(`env config file path: ${configFilePath}`);

    if (fs.existsSync(configFilePath)) {
        logError('The config file already exists!');
        return;
    }

    /**
     * Keep in sync with IEnvConfig !!!
     */
    const config = {
        iesi_api_base_url: argv.url,
        iesi_api_timeout_in_seconds: argv.timeout || 10,
        translation_label_overrides: {
            en_GB: {},
        },
    };

    logProgress('Creating config file ...');
    writeFile({
        filePath: configFilePath,
        data: JSON.stringify(config),
    });

    logSuccess('Config file was created successfully.');
}
