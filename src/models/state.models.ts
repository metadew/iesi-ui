import { IObservableStateAction } from '@snipsonian/observable-state/es/actionableStore/types';
import { ISetStateProps } from '@snipsonian/observable-state/es/store/types';
import produce from 'immer';
import { api } from 'api';
import { TEnvConfigState } from './state/envConfig.models';
import { II18nState } from './state/i18n.models';
import { IUiState } from './state/ui.models';
import { ICustomAsyncEntity as ICustomAsyncEntityOrig, IEntitiesState } from './state/entities.models';
import { IAuthState } from './state/auth.models';

export type ICustomAsyncEntity<Data> = ICustomAsyncEntityOrig<Data>;

export interface IState {
    envConfig: TEnvConfigState;
    i18n: II18nState;
    ui: IUiState;
    auth: IAuthState;
    entities: IEntitiesState;
}

/**
 * When a notification is triggered, by default also the immediate parent notification (delimited by a .)
 * gets triggered.
 * Example:
 *   triggering I18N.TRANSLATIONS.TOGGLE
 *   results in the trigger of both I18N.TRANSLATIONS.TOGGLE and I18N.TRANSLATIONS
 *
 * p.s. the number of parent levels to get triggered can be overruled per action.
 */
export enum StateChangeNotification {
    CONSTANTS_ACTION_TYPES = 'CONSTANTS.ACTION_TYPES',
    ENV_CONFIG = 'ENV_CONFIG',
    I18N_TRANSLATIONS = 'I18N.TRANSLATIONS',
    I18N_TRANSLATIONS_REFRESHED = 'I18N.TRANSLATIONS.REFRESHED',
    I18N_TRANSLATIONS_TOGGLE = 'I18N.TRANSLATIONS.TOGGLE',
    FLASH_MESSAGES = 'FLASH_MESSAGES',
    POLLING_EXECUTION_REQUESTS = 'POLLING_EXECUTION_REQUESTS',
    AUTH = 'AUTH',
    DESIGN_SCRIPTS_LIST = 'DESIGN.SCRIPTS.LIST',
    DESIGN_SCRIPTS_DETAIL = 'DESIGN.SCRIPTS.DETAIL',
    EXECUTION_REQUESTS_LIST = 'EXECUTION_REQUESTS.LIST',
    EXECUTION_REQUESTS_DETAIL = 'EXECUTION_REQUESTS.DETAIL',
    EXECUTION_REQUESTS_CREATE = 'EXECUTION_REQUESTS.CREATE',
    ENVIRONMENTS = 'ENVIRONMENTS',
    SCRIPT_EXECUTION_DETAIL = 'SCRIPT_EXECUTION.DETAIL',
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IAction<Payload>
    extends IObservableStateAction<string, Payload, IState, IExtraProcessInput, StateChangeNotification> {}

export interface IExtraProcessInput {
    api: typeof api;
    produce: typeof produce;
    setStateImmutable: ISetStateImmutable;
}

export interface ISetStateImmutable {
    (props: ISetStateImmutableProps): void;
}

export interface ISetStateImmutableProps
    // eslint-disable-next-line max-len
    extends Pick<ISetStateProps<IState, StateChangeNotification>, 'notificationsToTrigger' | 'nrOfParentNotificationLevelsToTrigger' | 'context'> {
    toState: (draftState: IState) => void;
}
