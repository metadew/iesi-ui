import { IScript } from 'models/state/scripts.models';
import { sortBy } from 'lodash';

export function getUniqueIdFromScript(script: IScript) {
    return script && script.name
        ? `${script.name}-${script.version.number}` : '';
}

export function getLatestVersionsFromScripts(scripts: IScript[]) {
    return getLatestVersionsFromScriptNames(getUniqueScriptNames());

    function getUniqueScriptNames() {
        return scripts
            .reduce(
                (acc, script) => {
                    const scriptNameInList = acc.find((scriptName) => scriptName === script.name);
                    if (!scriptNameInList) {
                        acc.push(script.name);
                    }
                    return acc;
                },
                [] as string[],
            );
    }

    function getLatestVersionsFromScriptNames(uniqueScriptNames: string[]) {
        return uniqueScriptNames.map((scriptName) => {
            const scriptsWithName = scripts.filter((script) => script.name === scriptName);
            return sortBy(scriptsWithName, [(script) => script.version.number]).reverse()[0];
        });
    }
}
