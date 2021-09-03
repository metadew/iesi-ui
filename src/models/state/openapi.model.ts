import { IComponent } from './components.model';
import { IConnection } from './connections.model';
import { IScriptBase } from './scripts.models';

export interface IOpenAPIEntity {
    version: string;
    title: string;
    connections: IConnection[];
    components: IComponent[];
}

export interface IOpenAPIEntityScript {
    version: string;
    title: string;
    scripts : IScriptBase[];
}

export interface IOpenAPI {
    value: string | FormData;
}
