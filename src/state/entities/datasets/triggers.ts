import entitiesStateManager from 'state/entities/entitiesStateManager';
import {
    IDataset,
    IDatasetBase,
    IDatasetByNamePayload,
    IDatasetByUuidPayload,
    IDatasetImplementation,
    IDatasetImplementationsByUuidPayload,
    IDatasetImportPayload,
    IFetchDatasetsListPayload,
} from 'models/state/datasets.model';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { StateChangeNotification } from 'models/state.models';
import { fetchImplementations, triggerFlashMessage } from 'state/ui/actions';

export const triggerFetchDatasets = (payload: IFetchDatasetsListPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.datasets,
            refreshMode: 'always',
            resetDataOnTrigger: false,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DATA_DATASETS_LIST],
    });

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

export const triggerExportDatasetDetail = (payload: IDatasetByNamePayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.datasetDetailExport,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DATA_DATASETS_DETAIL],
    });

export const triggerImportDatasetDetail = (payload: IDatasetImportPayload) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.datasetDetailImport,
        },
        onSuccess: ({ dispatch }) => dispatch(
            triggerFlashMessage({
                type: 'success',
                translationKey: 'flash_messages.datasets.import',
            }),
        ),
        onFail: ({ dispatch, error }) => {
            if (error.status) {
                dispatch(triggerFlashMessage({
                    translationKey: 'flash_messages.common.responseError',
                    translationPlaceholders: {
                        message: error.response?.message,
                    },
                    type: 'error',
                }));
            } else {
                dispatch(triggerFlashMessage({
                    translationKey: 'flash_messages.datasets.import_error',
                }));
            }
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DATA_DATASETS_DETAIL],
    });

export const triggerCreateDatasetDetail = (payload: IDatasetBase) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.datasetDetail,
        },
        onSuccess: ({ dispatch, currentEntity }) => dispatch(
            triggerFlashMessage({
                type: 'success',
                translationKey: 'datasets.detail.flash_messages.create_success',
                translationPlaceholders: {
                    name: (currentEntity as IDataset).name,
                },
            }),
        ),
        onFail: ({ dispatch }) => dispatch(
            triggerFlashMessage({
                type: 'error',
                translationKey: 'datasets.detail.flash_messages.create_error',
            }),
        ),
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DATA_DATASETS_DETAIL],
    });

export const triggerUpdateDatasetDetail = (payload: IDataset) =>
    entitiesStateManager.triggerAsyncEntityUpdate<{}>({
        asyncEntityToUpdate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.datasetDetail,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch, currentEntity }) => dispatch(
            triggerFlashMessage({
                type: 'success',
                translationKey: 'datasets.detail.flash_messages.update_success',
                translationPlaceholders: {
                    name: (currentEntity as IDataset).name,
                },
            }),
        ),
        onFail: ({ dispatch }) => dispatch(
            triggerFlashMessage({
                type: 'error',
                translationKey: 'datasets.detail.flash_messages.update_error',
            }),
        ),
        notificationsToTrigger: [StateChangeNotification.DATA_DATASETS_DETAIL],
    });

export const triggerFetchDatasetImplementations = (payload: IDatasetImplementationsByUuidPayload) =>
    entitiesStateManager.triggerAsyncEntityFetch<{}>({
        asyncEntityToFetch: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.datasetImplementations,
            refreshMode: 'always',
            resetDataOnTrigger: true,
        },
        extraInputSelector: () => payload,
        onSuccess: ({ dispatch, currentEntity }) => dispatch(
            fetchImplementations({
                implementations: currentEntity as IDatasetImplementation[],
            }),
        ),
        notificationsToTrigger: [StateChangeNotification.DATA_DATASETS_IMPLEMENTATIONS],
    });

export const triggerDeleteDatasetDetail = (payload: IDatasetByUuidPayload) => {
    entitiesStateManager.triggerAsyncEntityRemove<{}>({
        asyncEntityToRemove: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.datasetDetail,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.DATA_DATASETS_DETAIL],
    });
};
