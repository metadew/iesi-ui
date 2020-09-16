import { OptionsObject, SnackbarKey, VariantType } from 'notistack';
import { ITranslatorPlaceholders } from '@snipsonian/react/es/components/i18n/translator/types';
import { INavigateToRoute } from 'models/router.models';
import { ListFilters, ISortedColumn } from 'models/list.models';
import { IColumnNames as IScriptsColumnNames } from 'models/state/scripts.models';
import { IColumnNames as IExecutionsColumnNames } from 'models/state/executionRequests.models';

export interface IUiState {
    flashMessages: IFlashMessage[];
    pollingExecutionRequestIds: string[];
    listFilters: {
        scripts: IScriptsListFilters;
        executions: IListFilters<IExecutionsColumnNames>;
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

interface IListFilters<ColumnNames> {
    filters: ListFilters<Partial<ColumnNames>>;
    page: number;
    sortedColumn: ISortedColumn<ColumnNames>;
}

interface IScriptsListFilters extends IListFilters<IScriptsColumnNames> {
    onlyShowLatestVersion: boolean;
}
