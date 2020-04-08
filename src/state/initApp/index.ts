import listenForTranslationKeyToggles
    from '@snipsonian/react/es/components/i18n/translator/listenForTranslationKeyToggles';
import { toggleTranslationKeys } from 'state/i18n/actions';
import { getStore } from '../index';
import { fetchEnvConfig } from '../envConfig/actions';

const { dispatch } = getStore();

export default function initApp() {
    initEnvConfig();

    listenForTranslationKeyToggles({
        onToggle: () => dispatch(toggleTranslationKeys()),
    });
}

function initEnvConfig() {
    dispatch(fetchEnvConfig());
}
