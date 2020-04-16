import { OptionsObject, SnackbarKey, VariantType } from 'notistack';
import ROUTE_KEYS from 'routeKeys';
import { ITranslatorPlaceholders } from '@snipsonian/react/es/components/i18n/translator/types';

export interface IUiState {
    flashMessages: IFlashMessage[];
}

interface INavigateToRoutePayload {
    routeKey: ROUTE_KEYS;
}

export interface ITriggerFlashMessagePayload {
    translationKey: string;
    translationPlaceholders?: ITranslatorPlaceholders;
    type?: VariantType;
    options?: OptionsObject;
    navigateToRoute?: INavigateToRoutePayload;
}

export interface IFlashMessage {
    translationKey: string;
    translationPlaceholders: ITranslatorPlaceholders;
    options: OptionsObject;
    dismissed: boolean;
    key: SnackbarKey;
    navigateToRoute: INavigateToRoutePayload;
}
