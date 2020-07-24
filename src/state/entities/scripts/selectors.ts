import { IState } from 'models/state.models';
import { getUniqueIdFromScript } from 'utils/scripts/scriptUtils';

export const getAsyncScripts = (state: IState) => state.entities.scripts;

export const getScriptByUniqueId = (state: IState, uniqueId: string) => {
    const scripts = getAsyncScripts(state).data || [];
    return scripts.find((script) => getUniqueIdFromScript(script) === uniqueId);
};

export const getAsyncScriptDetail = (state: IState) => state.entities.scriptDetail;
