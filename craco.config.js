/* eslint-disable @typescript-eslint/no-var-requires */
const { ESLINT_MODES, addBeforeLoader, loaderByName } = require('@craco/craco');
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
        configure: (webpackConfig /* , { env, paths } */) => {
            const yamlLoader = {
                test: /\.ya?ml$/,
                type: 'json', // Required by Webpack v4
                use: 'yaml-loader',
            };

            addBeforeLoader(webpackConfig, loaderByName('file-loader'), yamlLoader);

            return webpackConfig;
        },
    },
};
