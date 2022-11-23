const chalk = require('chalk');

const { log } = console;
const BASIC_LOG_PREFIX = '  ';

const emphasis = chalk.bold;
const error = emphasis.red;
const success = emphasis.green;
const status = emphasis.yellow;

module.exports = {
    styles: {
        emphasis,
        error,
        success,
        status,
    },

    log: (toLog) => log(BASIC_LOG_PREFIX + toLog),
    logStatus: (toLog) => log(status(`\n${toLog}\n`)),
    logProgress: (toLog) => log(emphasis(`\n${toLog}`)),
    logError: (toLog) => log(error(`\n${toLog}\n`)),
    logSuccess: (toLog) => log(success(`\n${toLog}\n`)),
};
