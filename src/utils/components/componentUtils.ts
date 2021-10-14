import { IComponent } from 'models/state/components.model';

export function getUniqueIdFromComponent(component: IComponent) {
    return component && component.name
        ? `${component.name}-${component.version.number}` : '';
}
