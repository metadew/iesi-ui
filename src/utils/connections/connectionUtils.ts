import { IConnectionEntity } from 'models/state/connections.model';

export function getUniqueIdFromConnection(connection: IConnectionEntity) {
    return connection && connection.name
        ? `${connection.name}-${connection.environment}` : '';
}
