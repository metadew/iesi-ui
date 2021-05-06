import { IComponent } from './components.model';
import { IConnection } from './connections.model';

export interface IOpenAPIEntity {
    version: string;
    title: string;
    connections: IConnection[];
    components: IComponent[];
}

export interface IOpenAPI {
    value: string | FormData;
}
