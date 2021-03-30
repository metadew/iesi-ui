import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { IOpenAPI } from 'models/state/openapi.model';

export const triggerCreateTransformDocumentation = (payload: IOpenAPI) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.openapi,
            updateDataOnSuccess: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [],
    });
