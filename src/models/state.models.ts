import { IObservableStateAction } from '@snipsonian/observable-state/es/actionableStore/types';
import produce from 'immer';
import { api } from 'api';
import { TEnvConfigState } from './state/envConfig.models';
import { II18nState } from './state/i18n.models';
import { ICustomAsyncEntity as ICustomAsyncEntityOrig } from './state/types';

export type ICustomAsyncEntity<Data> = ICustomAsyncEntityOrig<Data>;

export interface IState {
    envConfig: TEnvConfigState;
    i18n: II18nState;
}

export enum StateChangeNotification {
    ENV_CONFIG = 'ENV_CONFIG',
    I18N_TRANSLATIONS = 'I18N.TRANSLATIONS',
    I18N_TRANSLATIONS_REFRESHED = 'I18N.TRANSLATIONS.REFRESHED',
    I18N_TRANSLATIONS_TOGGLE = 'I18N.TRANSLATIONS.TOGGLE',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAction<Payload>
    extends IObservableStateAction<string, Payload, IState, IExtraProcessInput, StateChangeNotification> {}

export interface IExtraProcessInput {
    api: typeof api;
    produce: typeof produce;
}
