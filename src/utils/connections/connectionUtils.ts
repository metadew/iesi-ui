import { IConnection } from 'models/state/connections.model';

export function getUniqueIdFromConnection(connection: IConnection) {
    return connection && connection.name
        ? connection.name : '';
}
