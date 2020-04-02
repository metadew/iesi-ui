// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ESLINT_MODES } = require('@craco/craco');

module.exports = {
    eslint: {
        mode: ESLINT_MODES.file,
    },
};
