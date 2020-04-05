import getLocalDvlpConfig from '@snipsonian/dvlp/es/storedConfig/getLocalDvlpConfig';
import { STATE_STORAGE_KEY } from './state.config';

const DEFAULT_DEV_CONFIG = {
    ENABLE_API_LOGGING: false,
    ENABLE_STATE_LOGGING: false,
    ENABLE_STATE_STORAGE: true,
};

// TODO pass generic instead of 'typeof DEFAULT_DEV_CONFIG'
const devConfig = getLocalDvlpConfig<typeof DEFAULT_DEV_CONFIG>({
    storageKey: `${STATE_STORAGE_KEY}_DVLP`,
    defaultDevConfig: DEFAULT_DEV_CONFIG,
});

export const isApiLoggingEnabled = devConfig.ENABLE_API_LOGGING as boolean;
export const isStateLoggingEnabled = devConfig.ENABLE_STATE_LOGGING as boolean;
export const isStateStorageEnabled = devConfig.ENABLE_STATE_STORAGE as boolean;
