import { IComponentEntity } from 'models/state/components.model';

export function getUniqueIdFromComponent(component: IComponentEntity) {
    return component && component.name
        ? `${component.name}-${component.version.number}` : '';
}
