import { IEnvironment } from 'models/state/environments.models';

export function getUniqueIdFromEnvironment(environment: IEnvironment) {
    return environment && environment.name
        ? environment.name : '';
}
