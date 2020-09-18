import { IScriptAction } from 'models/state/scripts.models';

export default function uniqueActionNamesCheck({
    actions,
}: {
    actions: IScriptAction[];
}): { passed: boolean } {
    let encounteredDuplicateName = false;

    const uniqueActionNames: string[] = [];

    actions.forEach((action) => {
        if (!uniqueActionNames.includes(action.name)) {
            uniqueActionNames.push(action.name);
        } else {
            encounteredDuplicateName = true;
        }
    });

    return { passed: !encounteredDuplicateName };
}
