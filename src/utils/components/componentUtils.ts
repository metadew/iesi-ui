import { IComponentEntity } from 'models/state/components.model';

export function getUniqueIdFromComponent(component: IComponentEntity) {
    return component && component.name
        ? `${component.name}-${component.version.number}` : '';
}

export function componentsEqual({
    name,
    type,
    description,
    version,
    parameters,
}: IComponentEntity, {
    name: newName,
    type: newType,
    description: newDescription,
    version: newVersion,
    parameters: newParameters,
}: IComponentEntity) {
    if (
        name === newName
        && type === newType
        && description === newDescription
        && version.number === newVersion.number
        && version.description === newVersion.description
        && parameters[0].value === newParameters[0].value
        && parameters[1].value === newParameters[1].value
        && parameters[2].value === newParameters[2].value
    ) {
        return true;
    }
    return false;
}
