import { IState } from 'models/state.models';
import { getUniqueIdFromScript } from 'utils/scripts/scriptUtils';
import { IScriptBase } from 'models/state/scripts.models';

export const getAsyncScriptsEntity = (state: IState) => state.entities.scripts;

export const getAsyncScripts = (state: IState) => {
    const scriptsEntity = getAsyncScriptsEntity(state);
    return scriptsEntity && scriptsEntity.data && scriptsEntity.data.scripts
        ? scriptsEntity.data.scripts : [] as IScriptBase[];
};

export const getAsyncScriptsPageData = (state: IState) => {
    const scriptsEntity = getAsyncScriptsEntity(state);
    return scriptsEntity && scriptsEntity.data ? scriptsEntity.data.page : null;
};

export const getAsyncScriptDetail = (state: IState) => state.entities.scriptDetail;

export const getScriptByUniqueIdFromDetailOrList = (state: IState, uniqueId: string) => {
    const scriptDetail = getAsyncScriptDetail(state);
    if (scriptDetail.data && getUniqueIdFromScript(scriptDetail.data) === uniqueId) {
        return scriptDetail.data;
    }

    const scripts = getAsyncScripts(state);
    return scripts.find((script) => getUniqueIdFromScript(script) === uniqueId);
};
