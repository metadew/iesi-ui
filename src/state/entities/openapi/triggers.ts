import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { IOpenAPI } from 'models/state/openapi.model';
import { StateChangeNotification } from 'models/state.models';
import { redirectTo, ROUTE_KEYS } from 'views/routes';

export const triggerCreateTransformDocumentation = (payload: IOpenAPI) =>
    entitiesStateManager.triggerAsyncEntityCreate<{}>({
        asyncEntityToCreate: {
            asyncEntityKey: ASYNC_ENTITY_KEYS.openapi,
            updateDataOnSuccess: true,
        },
        extraInputSelector: () => payload,
        notificationsToTrigger: [StateChangeNotification.OPENAPI_TRANSFORM],
        onSuccess: () => {
            redirectTo({ routeKey: ROUTE_KEYS.R_OPENAPI });
        },
    });
