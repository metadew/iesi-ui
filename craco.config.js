/* eslint-disable @typescript-eslint/no-var-requires */
const { ESLINT_MODES } = require('@craco/craco');
const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    eslint: {
        mode: ESLINT_MODES.file,
    },
    webpack: {
        plugins: [
            new StyleLintPlugin({
                configBasedir: __dirname,
                context: path.resolve(__dirname, 'src'),
                files: ['**/*.scss'],
            }),
        ],
    },
};
