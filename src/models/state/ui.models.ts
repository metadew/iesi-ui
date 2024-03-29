import { OptionsObject, SnackbarKey, VariantType } from 'notistack';
import { ITranslatorPlaceholders } from '@snipsonian/react/es/components/i18n/translator/types';
import { INavigateToRoute } from 'models/router.models';
import { ISortedColumn, ListFilters } from 'models/list.models';
import { IColumnNames as IScriptsColumnNames } from 'models/state/scripts.models';
import { IColumnNames as IExecutionsColumnNames } from 'models/state/executionRequests.models';
import { ITemplateColumnNames } from 'models/state/templates.model';
import { IComponentColumnNames } from './components.model';
import { IConnectionColumnNamesBase } from './connections.model';
import { IDatasetColumnNames } from './datasets.model';
import { IEnvironmentColumnNamesBase } from './environments.models';
import { IUserColumnName } from './user.model';
import { ITeamColumnNames } from './team.model';
import { ISecurityGroupColumnNames } from './securityGroups.model';

export interface IUiState {
    flashMessages: IFlashMessage[];
    pollingExecutionRequestIds: string[];
    listFilters: {
        scripts: IScriptsListFilters;
        components: IComponentsListFilters;
        connections: IListFilters<IConnectionColumnNamesBase>;
        environments: IListFilters<IEnvironmentColumnNamesBase>;
        executions: IListFilters<IExecutionsColumnNames>;
        datasets: IListFilters<IDatasetColumnNames>;
        users: IListFilters<IUserColumnName>;
        teams: IListFilters<ITeamColumnNames>;
        securityGroups: IListFilters<ISecurityGroupColumnNames>;
        templates: ITemplatesListFilters;
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

interface ITemplatesListFilters extends IListFilters<ITemplateColumnNames> {
    onlyShowLatestVersion: boolean;
}
