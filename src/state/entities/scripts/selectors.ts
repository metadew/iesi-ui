import { IState } from 'models/state.models';

export const getAsyncScripts = (state: IState) => state.entities.scripts;

export const getScriptByName = (state: IState, scriptName: string) => {
    const scripts = getAsyncScripts(state).data || [];
    return scripts.find((script) => script.name === scriptName);
};
