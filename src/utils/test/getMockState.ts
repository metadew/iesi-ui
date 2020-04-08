import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { ICustomAsyncEntity, IState } from 'models/state.models';
import { IEnvConfig } from 'models/state/envConfig.models';

export default function getMockState({
    envConfig = getDefaultEnvConfig(),
}: {
    envConfig?: ICustomAsyncEntity<IEnvConfig>;
}): IState {
    return {
        envConfig,
    } as IState;
}

function getDefaultEnvConfig(): ICustomAsyncEntity<IEnvConfig> {
    return {
        data: {
            iesi_api_base_url: 'https://some.iesi-api.be',
            iesi_api_timeout_in_seconds: 1,
            translation_label_overrides: {
                en_GB: {},
            },
        },
        fetch: {
            status: AsyncStatus.Success,
            error: null,
        },
    };
}
