import { IObservableStateAction } from '@snipsonian/observable-state/es/actionableStore/types';
import produce from 'immer';
import { IEnvConfig } from './state/envConfig.models';
import { api } from '../api';
import { IAsyncEntity } from '../snipsonian/observable-state/src/actionableStore/entities/types';
import { ITraceableApiError } from './api.models';

export interface IState {
    envConfig: ICustomAsyncEntity<IEnvConfig>;
}

export enum StateChangeNotification {
    ENV_CONFIG = 'ENV_CONFIG',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAction<Payload>
    extends IObservableStateAction<string, Payload, IState, IExtraProcessInput, StateChangeNotification> {}

export interface IExtraProcessInput {
    api: typeof api;
    produce: typeof produce;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ICustomAsyncEntity<Data> extends IAsyncEntity<Data, ITraceableApiError> {}
