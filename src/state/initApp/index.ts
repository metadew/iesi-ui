import listenForTranslationKeyToggles
    from '@snipsonian/react/es/components/i18n/translator/listenForTranslationKeyToggles';
import { toggleTranslationKeys } from 'state/i18n/actions';
import executePeriodically from 'utils/tabVisibility/executePeriodicallyWhenBrowserTabActive';
import { checkPollingExecutionRequests } from 'state/ui/actions';
import { INTERVAL_IN_MILLIS } from 'config/state.config';
import { getStore } from '../index';
import { fetchEnvConfig } from '../envConfig/actions';

const { dispatch } = getStore();

export default function initApp() {
    initEnvConfig();

    listenForTranslationKeyToggles({
        onToggle: () => dispatch(toggleTranslationKeys()),
    });

    executePeriodically({
        toBeExecuted: () => dispatch(checkPollingExecutionRequests()),
        intervalInMillis: INTERVAL_IN_MILLIS.CHECK_STATUS_EXECUTION_REQUESTS,
        executeImmediatelyInActiveTab: true,
        onlyIfBrowserTabActive: true,
    });
}

function initEnvConfig() {
    dispatch(fetchEnvConfig());
}
