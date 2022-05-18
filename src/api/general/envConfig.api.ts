import { IEnvConfig } from 'models/state/envConfig.models';
// eslint-disable-next-line import/no-cycle
import { get } from '../requestWrapper';
import API_URLS from '../apiUrls';

export function fetchEnvironmentConfig() {
    return get<IEnvConfig>({
        url: API_URLS.ENV_CONFIG,
        isIesiApi: false,
        addCacheBuster: true,
    });
}
