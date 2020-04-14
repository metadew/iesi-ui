const OFF = 'off';
const ERROR = 'error';
const WARN = 'warn';

module.exports = {
    parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
    plugins: ['@typescript-eslint'],
    extends: [
        './node_modules/@kunstmaan/eslint-typescript-config/index.js',
    ],
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    parserOptions: {
        ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
        sourceType: 'module',  // Allows for the use of imports
    },
    settings: {
        'import/resolver': {
            node: {
                paths: ['src'],
            }
        },
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': [OFF],
        'react/jsx-props-no-spreading': [OFF],
    },
};
