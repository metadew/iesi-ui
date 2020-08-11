import listenForTranslationKeyToggles
    from '@snipsonian/react/es/components/i18n/translator/listenForTranslationKeyToggles';
import { toggleTranslationKeys } from 'state/i18n/actions';
import executePeriodicallyWhenBrowserTabActive from 'utils/tabVisibility/executePeriodicallyWhenBrowserTabActive';
import { checkPollingExecutionRequests, addPollingExecutionRequest } from 'state/ui/actions';
import { INTERVAL_IN_MILLIS } from 'config/state.config';
import { getStore } from '../index';
import { fetchEnvConfig } from '../envConfig/actions';

const { dispatch } = getStore();

export default function initApp() {
    initEnvConfig();

    listenForTranslationKeyToggles({
        onToggle: () => dispatch(toggleTranslationKeys()),
    });

    // TODO: testing! Remove this line when finished
    dispatch(addPollingExecutionRequest({ id: 'bffb85ce-dafc-41c9-96d3-0de63b1c3393' }));

    executePeriodicallyWhenBrowserTabActive({
        // toBeExecuted: () => dispatch(fetchGlobalConfig()),
        toBeExecuted: () => dispatch(checkPollingExecutionRequests()),
        intervalInMillis: INTERVAL_IN_MILLIS.CHECK_STATUS_EXECUTION_REQUESTS,
        executeImmediatelyInActiveTab: true,
    });
}

function initEnvConfig() {
    dispatch(fetchEnvConfig());
}
