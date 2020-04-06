import { getStore } from '../index';
import { fetchEnvConfig } from '../envConfig/actions';

export default function initApp() {
    initEnvConfig();
}

function initEnvConfig() {
    getStore().dispatch(fetchEnvConfig());
}
