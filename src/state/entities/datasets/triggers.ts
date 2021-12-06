import entitiesStateManager from 'state/entities/entitiesStateManager';
import { IDatasetBase, IDatasetByNamePayload } from 'models/state/datasets.model';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';

export const triggerFetchDatasetDetail = (payload: IDatasetByNamePayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.datasetDetail,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DATA_DATASETS_DETAIL],
    });

export const triggerCreateDatasetDetail = (payload: IDatasetBase) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.datasetDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DATA_DATASETS_DETAIL],
    });
