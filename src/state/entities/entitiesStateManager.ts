import initAsyncEntitiesStateManager
    from 'snipsonian/observable-state/src/actionableStore/entities/initAsyncEntitiesStateManager';
import { IExtraProcessInput, IState, StateChangeNotification } from 'models/state.models';
import { ITraceableApiError } from 'models/api.models';
import configuredStore from 'state/setup/configuredStore';
import entitiesConfigManager from './entitiesConfigManager';

const entitiesStateManager = initAsyncEntitiesStateManager<IState, {}, ITraceableApiError,
string, StateChangeNotification, IExtraProcessInput>({
    asyncEntitiesConfigManager: entitiesConfigManager,
    store: configuredStore,
});

export default entitiesStateManager;
