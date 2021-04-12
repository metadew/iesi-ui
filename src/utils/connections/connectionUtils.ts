import { IConnectionEntity } from 'models/state/connections.model';

export function getUniqueIdFromConnection(connection: IConnectionEntity) {
    return connection && connection.name
        ? `${connection.name}-${connection.environment}` : '';
}

export function connectionsEqual({
    name,
    type,
    description,
    environment,
    parameters,
}: IConnectionEntity, {
    name: newName,
    type: newType,
    description: newDescription,
    environment: newEnvironment,
    parameters: newParameters,
}: IConnectionEntity) {
    if (
        name === newName
        && type === newType
        && description === newDescription
        && environment === newEnvironment
        && parameters[0].value === newParameters[0].value
        && parameters[1].value === newParameters[1].value
        && parameters[2].value === newParameters[2].value
        && parameters[3].value === newParameters[3].value
    ) {
        return true;
    }
    return false;
}
