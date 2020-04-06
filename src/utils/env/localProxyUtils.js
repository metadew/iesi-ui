/* eslint-disable import/no-extraneous-dependencies,@typescript-eslint/no-var-requires */
const proxy = require('http-proxy-middleware');
const winston = require('winston');

const transports = [new winston.transports.Console()];
if (process.env.NODE_ENV === 'development') {
    transports.push(new winston.transports.File({ filename: 'proxy.log' }));
}

const logger = winston.createLogger({
    transports,
});

const logLevel = (process.env.NODE_ENV === 'development') ? 'debug' : 'info';

function logProvider() {
    return logger;
}

module.exports = {
    proxyCall,
    interceptGetCall,
    interceptPutCall,
    interceptPostCall,
};

function proxyCall(
    app,
    {
        contextUrl,
        targetUrl,
        /**
         * 'changeOrigin: true' is needed, otherwise ERR_TLS_CERT_ALTNAME_INVALID error because
         * http is redirected to https
         * see https://github.com/chimurai/http-proxy-middleware/issues/238
         */
        changeOrigin = true,
        /**
         * E.g. for pathRewrite
         * Example:
         *   pathRewrite: {
         *       '^/env-config$': '/config/local.json',
         *   },
         */
        customOptions = {},
    },
) {
    app.use(proxy(contextUrl, {
        ...customOptions,
        target: targetUrl,
        changeOrigin,
        logLevel,
        logProvider,
    }));
}

/**
 * If the proxy detects 'urlToIntercept', then this method will respond with the result
 * of the toResponse function.
 * This 'toResponse' is called with the request object so that a different response can be returned
 * depending on the path (req.params) or query (req.query) params, or the headers (req.headers) for example.
 */
function interceptGetCall(
    app,
    options,
) {
    interceptCall('get', app, options);
}

function interceptPutCall(
    app,
    options,
) {
    interceptCall('put', app, options);
}

function interceptPostCall(
    app,
    options,
) {
    interceptCall('post', app, options);
}

function interceptCall(
    method,
    app,
    {
        url,
        toResponse,
        status = 200,
        timeoutInMillis = 0,
        enableIntercept = true,
    },
) {
    if (enableIntercept) {
        app[method](url, (request, response) => {
            if (timeoutInMillis && timeoutInMillis > 0) {
                setTimeout(() => {
                    response.status(status).json(toResponse(request));
                }, timeoutInMillis);
            } else {
                response.status(status).json(toResponse(request));
            }
        });
    }
}
