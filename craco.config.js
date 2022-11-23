/* eslint-disable @typescript-eslint/no-var-requires */
const { ESLINT_MODES, addBeforeLoader, loaderByName } = require('@craco/craco');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const StyleLintPlugin = require('stylelint-webpack-plugin');

const appSrc = path.resolve(__dirname, 'src');

module.exports = {
    eslint: {
        mode: ESLINT_MODES.file,
    },
    webpack: {
        alias: {
            /**
             * Add the aliases for all the top-level folders in the `src/` folder.
             * In combination with tsconfig.pathsOverride.json
             * See https://resir014.xyz/posts/2019/03/13/using-typescript-absolute-paths-in-cra-20/
             */
            api: `${appSrc}/api/`,
            config: `${appSrc}/config/`,
            models: `${appSrc}/models/`,
            snipsonian: `${appSrc}/snipsonian/`,
            state: `${appSrc}/state/`,
            utils: `${appSrc}/utils/`,
            views: `${appSrc}/views/`,
        },
        plugins: [
            new StyleLintPlugin({
                configBasedir: __dirname,
                context: appSrc,
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
    jest: {
        configure: {
            moduleNameMapper: {
                /**
                 * Jest module mapper which will detect our absolute imports.
                 * In combination with tsconfig.pathsOverride.json
                 * See https://resir014.xyz/posts/2019/03/13/using-typescript-absolute-paths-in-cra-20/
                 */
                '^api(.*)$': '<rootDir>/src/api$1',
                '^config(.*)$': '<rootDir>/src/config$1',
                '^models(.*)$': '<rootDir>/src/models$1',
                '^snipsonian(.*)$': '<rootDir>/src/snipsonian$1',
                '^state(.*)$': '<rootDir>/src/state$1',
                '^utils(.*)$': '<rootDir>/src/utils$1',
                '^views(.*)$': '<rootDir>/src/views$1',
            },
        },
    },
};
