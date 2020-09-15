import { OptionsObject, SnackbarKey, VariantType } from 'notistack';
import { ITranslatorPlaceholders } from '@snipsonian/react/es/components/i18n/translator/types';
import { INavigateToRoute } from 'models/router.models';
import { ListFilters, ISortedColumn } from 'models/list.models';
import { IColumnNames } from 'models/state/scripts.models';

export interface IUiState {
    flashMessages: IFlashMessage[];
    pollingExecutionRequestIds: string[];
    listFilters: {
        scripts: {
            filters: ListFilters<Partial<IColumnNames>>;
            onlyShowLatestVersion: boolean;
            page: number;
            sortedColumn: ISortedColumn<IColumnNames>;
        };
    };
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
