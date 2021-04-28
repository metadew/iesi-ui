import { IComponentEntity } from './components.model';
import { IConnectionEntity } from './connections.model';

export interface IOpenAPIEntity {
    version: string;
    title: string;
    connections: IConnectionEntity[];
    components: IComponentEntity[];
}

export interface IOpenAPI {
    value: string | FormData;
}
