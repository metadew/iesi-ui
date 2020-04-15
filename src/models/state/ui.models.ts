import { OptionsObject, SnackbarKey, VariantType } from 'notistack';
import ROUTE_KEYS from 'routeKeys';
import { ITranslatorPlaceholders } from '@snipsonian/react/es/components/i18n/translator/types';

export interface IUiState {
    flashMessages: IFlashMessage[];
}

export interface ITriggerFlashMessagePayload extends
    Pick<IFlashMessage, 'translationKey' | 'translationPlaceholders' | 'navigateToRoute'> {
    type?: VariantType;
    options?: OptionsObject;
}

export interface IFlashMessage {
    translationKey: string;
    translationPlaceholders?: ITranslatorPlaceholders;
    options: OptionsObject;
    dismissed: boolean;
    key: SnackbarKey;
    navigateToRoute?: {
        routeKey: ROUTE_KEYS;
    };
}
