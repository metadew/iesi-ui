import { OptionsObject, SnackbarKey, VariantType } from 'notistack';
import { ITranslatorPlaceholders } from '@snipsonian/react/es/components/i18n/translator/types';
import { INavigateToRoute } from 'models/router.models';
import { ListFilters, ISortedColumn } from 'models/list.models';
import { IColumnNames as IScriptsColumnNames } from 'models/state/scripts.models';
import { IColumnNames as IExecutionsColumnNames } from 'models/state/executionRequests.models';
import { IComponentColumnNames } from './components.model';
import { IConnectionColumnNamesBase } from './connections.model';
import { IDatasetColumnNames } from './datasets.model';

export interface IUiState {
    flashMessages: IFlashMessage[];
    pollingExecutionRequestIds: string[];
    listFilters: {
        scripts: IScriptsListFilters;
        components: IComponentsListFilters;
        connections: IListFilters<IConnectionColumnNamesBase>;
        executions: IListFilters<IExecutionsColumnNames>;
        datasets: IListFilters<IDatasetColumnNames>;
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

interface IListFilters<T> {
    filters: ListFilters<Partial<T>>;
    page: number;
    sortedColumn: ISortedColumn<T>;
}

interface IScriptsListFilters extends IListFilters<IScriptsColumnNames> {
    onlyShowLatestVersion: boolean;
}
interface IComponentsListFilters extends IListFilters<IComponentColumnNames> {
    onlyShowLatestVersion: boolean;
}
