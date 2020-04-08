import { IState } from '../../models/state.models';

export const getAsyncEnvConfig = (state: IState) => state.envConfig;

export const getTranslationLabelOverrides = (state: IState) => {
    const asyncEnvConfig = getAsyncEnvConfig(state);

    if (asyncEnvConfig && asyncEnvConfig.data && asyncEnvConfig.data.translation_label_overrides) {
        return asyncEnvConfig.data.translation_label_overrides;
    }

    return null;
};
