import { OptionsObject, SnackbarKey, VariantType } from 'notistack';
import { ITranslatorPlaceholders } from '@snipsonian/react/es/components/i18n/translator/types';
import { INavigateToRoute } from 'models/router.models';

export interface IUiState {
    flashMessages: IFlashMessage[];
}

export interface IFlashMessage {
    translationKey: string;
    translationPlaceholders: ITranslatorPlaceholders;
    options: OptionsObject;
    dismissed: boolean;
    key: SnackbarKey;
    navigateToRoute: INavigateToRoute;
}

export interface ITriggerFlashMessagePayload {
    translationKey: string;
    translationPlaceholders?: ITranslatorPlaceholders;
    type?: VariantType;
    options?: OptionsObject;
    navigateToRoute?: INavigateToRoute;
}
