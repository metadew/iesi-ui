import { IComponentEntity } from './components.model';
import { IConnectionEntity } from './connections.model';

export interface IOpenAPIEntity {
    connections: IConnectionEntity[];
    components: IComponentEntity[];
}

export interface IOpenAPI {
    value: string | FormData;
}
