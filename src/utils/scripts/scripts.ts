import { IScript } from 'models/state/scripts.models';

export function getUniqueIdFromScript(script: IScript) {
    return script && script.name
        ? `${script.name}-${script.version.number}` : '';
}
