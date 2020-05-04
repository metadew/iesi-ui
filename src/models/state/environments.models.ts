import { IParameter } from './iesiGeneric.models';

export interface IEnvironment {
    name: string;
    description: string;
    parameters?: IParameter[];
}
