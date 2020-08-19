import { IState } from 'models/state.models';
import { getUniqueIdFromScript } from 'utils/scripts/scriptUtils';
import { IScriptBase } from 'models/state/scripts.models';

export const getAsyncScriptsEntity = (state: IState) => state.entities.scripts;

export const getAsyncScripts = (state: IState) => {
    const scriptsEntity = getAsyncScriptsEntity(state);
    return scriptsEntity && scriptsEntity.data ? scriptsEntity.data.scripts : [] as IScriptBase[];
};

export const getScriptByUniqueId = (state: IState, uniqueId: string) => {
    const asyncData = getAsyncScriptsEntity(state).data;
    const scripts = (asyncData && asyncData.scripts) || [];
    return scripts.find((script) => getUniqueIdFromScript(script) === uniqueId);
};

export const getAsyncScriptDetail = (state: IState) => state.entities.scriptDetail;
