import { IState } from 'models/state.models';
import { IConnection } from 'models/state/connections.model';

export const getAsyncConnectionsEntity = (state: IState) => state.entities.connections;

export const getAsyncConnections = (state: IState) => {
    const connectionsEntity = getAsyncConnectionsEntity(state);
    return connectionsEntity && connectionsEntity.data && connectionsEntity.data.connections
        ? connectionsEntity.data.connections : [] as IConnection[];
};

export const getAsyncConnectionsPageData = (state: IState) => {
    const connectionsEntity = getAsyncConnectionsEntity(state);
    return connectionsEntity && connectionsEntity.data ? connectionsEntity.data.page : null;
};

export const getAsyncConnectionDetail = (state: IState) => state.entities.connectionDetail;
