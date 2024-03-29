import React, { ReactText } from 'react';
import {
    Box,
    Button,
    createStyles,
    FormControlLabel,
    Switch,
    Theme,
    Typography,
    WithStyles,
    withStyles,
} from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import GenericList from 'views/common/list/GenericList';
import GenericSort from 'views/common/list/GenericSort';
import { getTranslator } from 'state/i18n/selectors';

import { AddRounded, Delete, Edit, FileCopy, PlayArrowRounded, Visibility } from '@material-ui/icons';
import {
    FilterConfig,
    FilterType,
    IListItem,
    ISortedColumn,
    ListColumns,
    ListFilters,
    SortActions,
    SortOrder,
    SortType,
} from 'models/list.models';
import { IColumnNames, IExpandScriptsResponseWith, IScript, IScriptBase } from 'models/state/scripts.models';
import ContentWithSlideoutPanel from 'views/common/layout/ContentWithSlideoutPanel';
import GenericFilter from 'views/common/list/GenericFilter';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import { ROUTE_KEYS } from 'views/routes';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import { IObserveProps, observe } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
import {
    getAsyncScriptDetail,
    getAsyncScriptDetailImport,
    getAsyncScripts,
    getAsyncScriptsEntity,
    getAsyncScriptsPageData,
} from 'state/entities/scripts/selectors';
import { AsyncOperation, AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import OrderedList from 'views/common/list/OrderedList';
import { Alert } from '@material-ui/lab';
import {
    triggerDeleteScriptDetail,
    triggerFetchScripts,
    triggerImportScriptDetail,
} from 'state/entities/scripts/triggers';
import { getLatestVersionsFromScripts, getUniqueIdFromScript } from 'utils/scripts/scriptUtils';
import { triggerResetAsyncExecutionRequest } from 'state/entities/executionRequests/triggers';
import isSet from '@snipsonian/core/es/is/isSet';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { getScriptsListFilter } from 'state/ui/selectors';
import { setScriptsListFilter } from 'state/ui/actions';
import ReportIcon from 'views/common/icons/Report';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { checkAuthority } from 'state/auth/selectors';
import RouteLink from 'views/common/navigation/RouteLink';
import ExecuteScriptDialog from 'views/design/common/ExecuteScriptDialog';
import TextFileInputDialog from 'views/common/layout/TextFileInputDialog';
import { getDecodedToken } from 'utils/users/userUtils';
import DuplicateScriptDialog from '../common/DuplicateScriptDialog';

const styles = ({ palette, typography }: Theme) =>
    createStyles({
        header: {
            backgroundColor: palette.background.paper,
            borderBottom: '1px solid',
            borderBottomColor: palette.grey[200],
        },
        scriptName: {
            fontWeight: typography.fontWeightBold,
            color: palette.primary.main,
        },
        scriptVersion: {
            fontWeight: typography.fontWeightBold,
        },
        scriptDescription: {
            fontWeight: typography.fontWeightBold,
            fontSize: typography.pxToRem(12),
        },
        scriptLabels: {
            fontWeight: typography.fontWeightBold,
        },
        scriptSecurityGroupName: {
            fontWeight: typography.fontWeightBold,
            fontSize: typography.pxToRem(12),
        },
        generateTooltip: {
            backgroundColor: palette.common.black,
            fontSize: typography.pxToRem(12),
            padding: 16,
        },
        generateTooltipArrow: {
            color: palette.common.black,
        },
    });

export const filterConfig: FilterConfig<Partial<IColumnNames>> = {
    name: {
        label: <Translate msg="scripts.overview.list.filter.script_name" />,
        filterType: FilterType.Search,
    },
    labels: {
        label: <Translate msg="scripts.overview.list.filter.script_label" />,
        filterType: FilterType.KeyValue,
    },
};

const sortActions: SortActions<Partial<IColumnNames>> = {
    name: {
        label: <Translate msg="scripts.overview.list.sort.script_name" />,
        sortType: SortType.String,
    },
};

interface IScriptState {
    scriptIdToDelete: string;
    scriptIdToDuplicate: string;
    selectedScript: IScriptBase;
    importScriptDialogOpen: boolean;
}

const defaultSortedColumn: ISortedColumn<IColumnNames> = {
    name: 'name',
    sortOrder: SortOrder.Ascending,
    sortType: SortType.String,
};

type TProps = WithStyles<typeof styles>;

const ScriptsOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IScriptState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                scriptIdToDelete: null,
                scriptIdToDuplicate: null,
                selectedScript: null,
                importScriptDialogOpen: false,
            };

            this.renderPanel = this.renderPanel.bind(this);
            this.renderContent = this.renderContent.bind(this);
            this.onSort = this.onSort.bind(this);
            this.onFilter = this.onFilter.bind(this);

            this.clearScriptToDelete = this.clearScriptToDelete.bind(this);
            this.clearScriptToDuplicate = this.clearScriptToDuplicate.bind(this);
            this.setScriptToDelete = this.setScriptToDelete.bind(this);
            this.setScriptToDuplicate = this.setScriptToDuplicate.bind(this);
            this.onCloseExecuteDialog = this.onCloseExecuteDialog.bind(this);
            this.onCloseDuplicateDialog = this.onCloseDuplicateDialog.bind(this);
            this.setExecuteScriptDialogOpen = this.setExecuteScriptDialogOpen.bind(this);
            this.onImportScriptDialogOpen = this.onImportScriptDialogOpen.bind(this);
            this.onImportScriptDialogClose = this.onImportScriptDialogClose.bind(this);

            this.onDeleteScript = this.onDeleteScript.bind(this);
            // eslint-disable-next-line max-len
            this.closeDeleteScriptDialogAfterSuccessfulDelete = this.closeDeleteScriptDialogAfterSuccessfulDelete.bind(this);
            this.refreshListAfterSuccessfullDuplicate = this.refreshListAfterSuccessfullDuplicate.bind(this);
            // eslint-disable-next-line max-len
            this.closeImportDatasetDialogAfterSuccessfulCreate = this.closeImportDatasetDialogAfterSuccessfulCreate.bind(this);

            this.fetchScriptsWithFilterAndPagination = this.fetchScriptsWithFilterAndPagination.bind(this);
            this.combineFiltersFromUrlAndCurrentFilters = this.combineFiltersFromUrlAndCurrentFilters.bind(this);
        }

        public componentDidMount() {
            const { dispatch } = this.props;
            const initialFilters = this.combineFiltersFromUrlAndCurrentFilters();

            this.fetchScriptsWithFilterAndPagination({ newListFilters: initialFilters, newPage: 1 });
            dispatch(setScriptsListFilter({ filters: initialFilters }));
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            const { state, dispatch } = prevProps;
            const filterFromState = getScriptsListFilter(state);
            if (filterFromState.filters === null || filterFromState.sortedColumn === null) {
                dispatch(setScriptsListFilter({
                    filters: filterFromState.filters === null && getIntialFiltersFromFilterConfig(filterConfig),
                    sortedColumn: filterFromState.sortedColumn === null && {
                        name: 'name',
                        sortOrder: SortOrder.Ascending,
                        sortType: SortType.String,
                    },
                }));
            }

            this.closeDeleteScriptDialogAfterSuccessfulDelete(prevProps);
            this.refreshListAfterSuccessfullDuplicate(prevProps);
            this.closeImportDatasetDialogAfterSuccessfulCreate(prevProps);
        }

        public render() {
            const { classes, state } = this.props;
            const {
                scriptIdToDelete,
                selectedScript,
                importScriptDialogOpen,
                scriptIdToDuplicate,
            } = this.state;
            const filterFromState = getScriptsListFilter(state);
            const scripts = getAsyncScripts(this.props.state);
            const deleteStatus = getAsyncScriptDetail(this.props.state).remove.status;
            const importStatus = getAsyncScriptDetail(this.props.state).create.status;
            const pageData = getAsyncScriptsPageData(this.props.state);

            const listItems = mapScriptsToListItems(filterFromState.onlyShowLatestVersion
                ? getLatestVersionsFromScripts(scripts) : scripts);

            const translator = getTranslator(state);
            return (
                <>
                    <Box height="100%" display="flex" flexDirection="column" flex="1 0 auto">
                        <Box
                            paddingTop={3}
                            paddingBottom={3}
                            className={classes.header}
                        >
                            <AppTemplateContainer>
                                <Typography variant="h6">
                                    <Translate
                                        msg="scripts.overview.header.amount"
                                        placeholders={{ amount: pageData ? pageData.totalElements : 0 }}
                                    />
                                </Typography>
                                <Box display="flex" alignItems="flex-end">
                                    <Box flex="1 0 auto">
                                        <GenericSort
                                            sortActions={sortActions}
                                            onSort={this.onSort}
                                            sortedColumn={filterFromState.sortedColumn as ISortedColumn<{}>}
                                        />
                                    </Box>
                                    {checkAuthority(state, SECURITY_PRIVILEGES.S_SCRIPTS_WRITE)
                                        ? (
                                            <Box display="flex" alignItems="center" flex="0 0 auto">
                                                <Box flex="0 0 auto" mr="16px">
                                                    <TextFileInputDialog
                                                        open={importScriptDialogOpen}
                                                        onOpen={this.onImportScriptDialogOpen}
                                                        onClose={this.onImportScriptDialogClose}
                                                        onImport={(script) => triggerImportScriptDetail(script)}
                                                        showLoader={importStatus === AsyncStatus.Busy}
                                                        metadataName="script"
                                                    />
                                                </Box>
                                                <Box flex="0 0 auto">
                                                    <RouteLink to={ROUTE_KEYS.R_SCRIPT_NEW}>
                                                        <Button
                                                            variant="contained"
                                                            color="secondary"
                                                            size="small"
                                                            startIcon={<AddRounded />}
                                                        >
                                                            <Translate msg="scripts.overview.header.add_button" />

                                                        </Button>
                                                    </RouteLink>
                                                </Box>
                                            </Box>
                                        ) : null}

                                </Box>
                            </AppTemplateContainer>
                        </Box>
                        <ContentWithSlideoutPanel
                            toggleLabel={
                                <Translate msg="common.list.filter.toggle" />
                            }
                            panel={this.renderPanel({ listItems })}
                            content={this.renderContent({ listItems })}
                            initialIsOpenState={
                                (filterFromState.filters
                                    && (filterFromState.filters.name.values.length > 0
                                        || filterFromState.filters.labels.values.length > 0)
                                )
                            }
                        />
                    </Box>
                    <ConfirmationDialog
                        title={translator('scripts.overview.delete_script_dialog.title')}
                        text={translator('scripts.overview.delete_script_dialog.text')}
                        open={!!scriptIdToDelete}
                        onClose={this.clearScriptToDelete}
                        onConfirm={this.onDeleteScript}
                        showLoader={deleteStatus === AsyncStatus.Busy}
                    />
                    <DuplicateScriptDialog
                        scriptUniqueId={scriptIdToDuplicate}
                        open={!!scriptIdToDuplicate}
                        onClose={this.onCloseDuplicateDialog}
                    />
                    {
                        selectedScript && (
                            <ExecuteScriptDialog
                                onClose={this.onCloseExecuteDialog}
                                scriptName={selectedScript.name}
                                scriptVersion={selectedScript.version.number}
                            />
                        )
                    }
                </>
            );
        }

        private renderPanel({ listItems }: { listItems: IListItem<IColumnNames>[] }) {
            const { state, dispatch } = this.props;
            const translator = getTranslator(state);
            const filterFromState = getScriptsListFilter(state);
            return (
                <>
                    <GenericFilter
                        filterConfig={filterConfig}
                        onFilterChange={this.onFilter}
                        listItems={listItems}
                        initialFilters={filterFromState.filters}
                    />
                    <Box paddingX={5} paddingY={3}>
                        <FormControlLabel
                            control={(
                                <Switch
                                    checked={filterFromState.onlyShowLatestVersion}
                                    onClick={() => {
                                        this.fetchScriptsWithFilterAndPagination({
                                            newOnlyShowLatestVersion: !filterFromState.onlyShowLatestVersion,
                                        });
                                        dispatch(setScriptsListFilter({
                                            onlyShowLatestVersion: !filterFromState.onlyShowLatestVersion,
                                        }));
                                    }}
                                    color="secondary"
                                />
                            )}
                            label={translator('scripts.overview.list.filter.show_latest')}
                        />
                    </Box>
                </>
            );
        }

        private renderContent({ listItems }: { listItems: IListItem<IColumnNames>[] }) {
            const { classes, state, dispatch } = this.props;
            const translator = getTranslator(state);
            const columns: ListColumns<IColumnNames> = {
                name: {
                    className: classes.scriptName,
                    fixedWidth: '35%',
                },
                version: {
                    className: classes.scriptVersion,
                    fixedWidth: '5%',
                },
                description: {
                    className: classes.scriptDescription,
                    noWrap: true,
                    fixedWidth: '40%',
                },
                securityGroupName: {
                    className: classes.scriptSecurityGroupName,
                    fixedWidth: '10%',
                },
                labels: {
                    label: (
                        <Translate msg="scripts.overview.list.labels.labels" />
                    ),
                    className: classes.scriptLabels,
                    fixedWidth: '10%',
                },
            };

            const asyncScriptsEntity = getAsyncScriptsEntity(this.props.state);
            const scriptsFetchData = asyncScriptsEntity.fetch;
            const isFetching = scriptsFetchData.status === AsyncStatus.Busy;
            const hasError = scriptsFetchData.status === AsyncStatus.Error;

            const scriptsData = asyncScriptsEntity.data;
            const pageData = scriptsData ? scriptsData.page : null;

            return (
                <>
                    <Box paddingBottom={5} marginX={2.8}>
                        {!hasError && (
                            <GenericList
                                listActions={[].concat(
                                    {
                                        icon: <PlayArrowRounded />,
                                        label: translator('scripts.overview.list.actions.execute'),
                                        onClick: this.setExecuteScriptDialogOpen,
                                        hideAction: () =>
                                            !checkAuthority(
                                                state,
                                                SECURITY_PRIVILEGES.S_EXECUTION_REQUESTS_WRITE,
                                            ),
                                    },
                                    {
                                        icon: (id: string) => {
                                            const scripts = getAsyncScripts(this.props.state);
                                            const selectedScript = scripts.find((item) =>
                                                getUniqueIdFromScript(item) === id);
                                            return (
                                                <RouteLink
                                                    to={ROUTE_KEYS.R_SCRIPT_DETAIL}
                                                    params={{
                                                        name: selectedScript.name,
                                                        version: selectedScript.version.number,
                                                    }}
                                                >
                                                    <Edit />
                                                </RouteLink>
                                            );
                                        },
                                        onClick: () => {},
                                        label: translator('scripts.overview.list.actions.edit'),
                                        hideAction: () =>
                                            !checkAuthority(
                                                state,
                                                SECURITY_PRIVILEGES.S_SCRIPTS_WRITE,
                                            ),
                                    },
                                    {
                                        icon: (id: string) => {
                                            const scripts = getAsyncScripts(this.props.state);
                                            const selectedScript = scripts.find((item) =>
                                                getUniqueIdFromScript(item) === id);

                                            return (
                                                <RouteLink
                                                    to={ROUTE_KEYS.R_SCRIPT_DETAIL}
                                                    params={{
                                                        name: selectedScript.name,
                                                        version: selectedScript.version.number,
                                                    }}
                                                >
                                                    <Visibility />
                                                </RouteLink>
                                            );
                                        },
                                        label: translator('scripts.overview.list.actions.view'),
                                        onClick: () => {},
                                        hideAction: () =>
                                            checkAuthority(
                                                state,
                                                SECURITY_PRIVILEGES.S_SCRIPTS_WRITE,
                                                // eslint-disable-next-line max-len
                                            ) || !checkAuthority(state, SECURITY_PRIVILEGES.S_SCRIPTS_READ),
                                    },
                                    {
                                        label: translator('scripts.overview.list.actions.report'),
                                        icon: (id: string) => {
                                            const scripts = getAsyncScripts(this.props.state);
                                            const selectedScript = scripts.find((item) =>
                                                getUniqueIdFromScript(item) === id);

                                            return (
                                                <RouteLink
                                                    to={ROUTE_KEYS.R_REPORTS}
                                                    queryParams={{
                                                        script: selectedScript.name,
                                                        version: selectedScript.version.number,
                                                        requester: getDecodedToken().username,
                                                    }}
                                                >
                                                    <ReportIcon />
                                                </RouteLink>
                                            );
                                        },
                                        onClick: () => {},
                                        hideAction: () =>
                                            !checkAuthority(
                                                state,
                                                SECURITY_PRIVILEGES.S_EXECUTION_REQUESTS_READ,
                                            ),
                                    },
                                    {
                                        icon: <Delete />,
                                        label: translator('scripts.overview.list.actions.delete'),
                                        onClick: this.setScriptToDelete,
                                        hideAction: () =>
                                            !checkAuthority(
                                                state,
                                                SECURITY_PRIVILEGES.S_SCRIPTS_WRITE,
                                            ),
                                    },
                                    {
                                        icon: <FileCopy />,
                                        label: translator('scripts.overview.list.actions.duplicate'),
                                        onClick: this.setScriptToDuplicate,
                                        hideAction: () =>
                                            !checkAuthority(
                                                state,
                                                SECURITY_PRIVILEGES.S_SCRIPTS_WRITE,
                                            ),
                                    },
                                )}
                                columns={columns}
                                listItems={listItems}
                                pagination={{
                                    pageData,
                                    onChange: ({ page }) => {
                                        this.fetchScriptsWithFilterAndPagination({ newPage: page });
                                        dispatch(setScriptsListFilter({ page }));
                                    },
                                }}
                                isLoading={isFetching}
                            />
                        )}

                        {hasError && (
                            <Box padding={2}>
                                <Alert severity="error">
                                    <Translate msg="scripts.overview.list.fetch_error" />
                                </Alert>
                            </Box>
                        )}

                    </Box>
                </>
            );
        }

        private closeImportDatasetDialogAfterSuccessfulCreate(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncScriptDetailImport(this.props.state).create;
            const prevStatus = getAsyncScriptDetailImport(prevProps.state).create.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.setState({ importScriptDialogOpen: false });
                this.fetchScriptsWithFilterAndPagination({});
            }
        }

        private onImportScriptDialogOpen() {
            this.setState((state) => ({ ...state, importScriptDialogOpen: true }));
        }

        private onImportScriptDialogClose() {
            this.setState((state) => ({ ...state, importScriptDialogOpen: false }));
        }

        private onDeleteScript() {
            const { state } = this.props;
            const { scriptIdToDelete } = this.state;
            const scriptToDelete = getAsyncScripts(state).find((item) =>
                getUniqueIdFromScript(item) === scriptIdToDelete);

            if (scriptToDelete) {
                triggerDeleteScriptDetail({ name: scriptToDelete.name, version: scriptToDelete.version.number });
            }
        }

        private closeDeleteScriptDialogAfterSuccessfulDelete(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncScriptDetail(this.props.state).remove;
            const prevStatus = getAsyncScriptDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.clearScriptToDelete();
                this.fetchScriptsWithFilterAndPagination({ expandResponseWith: { scheduling: false } });
            }
        }

        private refreshListAfterSuccessfullDuplicate(prevProps: TProps & IObserveProps) {
            const currentStatus = getAsyncScriptDetail(this.props.state).create.status;
            const prevStatus = getAsyncScriptDetail(prevProps.state).create.status;

            if (currentStatus === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.clearScriptToDuplicate();
                this.fetchScriptsWithFilterAndPagination({ expandResponseWith: { scheduling: false } });
            }
        }

        private onSort(sortedColumn: ISortedColumn<IColumnNames>) {
            const { dispatch } = this.props;
            this.fetchScriptsWithFilterAndPagination({ newSortedColumn: sortedColumn });
            dispatch(setScriptsListFilter({ sortedColumn }));
        }

        private onFilter(listFilters: ListFilters<Partial<IColumnNames>>) {
            const { dispatch } = this.props;
            this.fetchScriptsWithFilterAndPagination({ newListFilters: listFilters });
            dispatch(setScriptsListFilter({ filters: listFilters }));
        }

        private combineFiltersFromUrlAndCurrentFilters() {
            const { state } = this.props;
            const filterFromState = getScriptsListFilter(state);
            const searchParams = new URLSearchParams(window.location.search);
            const defaultFilters = filterFromState.filters || getIntialFiltersFromFilterConfig(filterConfig);
            const hasValidUrlParams = Array.from(searchParams.keys()).some((r) =>
                Object.keys(filterConfig).includes(r));

            if (hasValidUrlParams) {
                // reset filters in redux state & only set url params
                const filtersByUrlSearchParams = getIntialFiltersFromFilterConfig(filterConfig);
                Array.from(searchParams.keys()).forEach(
                    (searchParamKey: string) => {
                        if (Object.keys(filterConfig).includes(searchParamKey)) {
                            const filterValue = searchParams.get(searchParamKey);
                            if (
                                !filtersByUrlSearchParams[searchParamKey as keyof IColumnNames]
                                    .values.includes(filterValue)
                            ) {
                                filtersByUrlSearchParams[searchParamKey as keyof IColumnNames].values.push(filterValue);
                            }
                        }
                    },
                );
                return filtersByUrlSearchParams;
            }

            return defaultFilters;
        }

        private fetchScriptsWithFilterAndPagination({
            newPage,
            newListFilters,
            newOnlyShowLatestVersion,
            newSortedColumn,
            expandResponseWith,
        }: {
            newPage?: number;
            newListFilters?: ListFilters<Partial<IColumnNames>>;
            newOnlyShowLatestVersion?: boolean;
            newSortedColumn?: ISortedColumn<IColumnNames>;
            expandResponseWith?: IExpandScriptsResponseWith;
        }) {
            const { state } = this.props;
            const pageData = getAsyncScriptsPageData(this.props.state);

            const filtersFromState = getScriptsListFilter(state);

            const filters = newListFilters || filtersFromState.filters;
            const page = newListFilters ? 1 : newPage || pageData.number;
            const onlyShowLatestVersion = isSet(newOnlyShowLatestVersion)
                ? newOnlyShowLatestVersion : filtersFromState.onlyShowLatestVersion;
            const sortedColumn = newSortedColumn || filtersFromState.sortedColumn || defaultSortedColumn;

            triggerFetchScripts({
                pagination: { page },
                filter: {
                    name: filters.name.values.length > 0
                        && filters.name.values[0].toString(),
                    version: onlyShowLatestVersion ? 'latest' : undefined,
                    label: filters.labels.values.length > 0
                        && filters.labels.values[0].toString(),
                },
                sort: formatSortQueryParameter(sortedColumn),
                expandResponseWith: isSet(expandResponseWith) ? expandResponseWith : {},
            });
        }

        private clearScriptToDelete() {
            this.setState({ scriptIdToDelete: null });
        }

        private clearScriptToDuplicate() {
            this.setState({ scriptIdToDuplicate: null });
        }

        private setScriptToDelete(id: ReactText) {
            this.setState({ scriptIdToDelete: id as string });
        }

        private setScriptToDuplicate(id: ReactText) {
            this.setState({ scriptIdToDuplicate: id as string });
        }

        private onCloseExecuteDialog() {
            triggerResetAsyncExecutionRequest({ operation: AsyncOperation.create });
            this.setState({ selectedScript: null });
        }

        private onCloseDuplicateDialog() {
            this.setState({ scriptIdToDuplicate: null });
        }

        private setExecuteScriptDialogOpen(id: ReactText) {
            const scripts = getAsyncScripts(this.props.state);
            const selectedScript = scripts.find((item) =>
                getUniqueIdFromScript(item) === id);
            this.setState({ selectedScript });
        }
    },
);

function mapScriptsToListItems(scripts: IScript[]): IListItem<IColumnNames>[] {
    return scripts.map((script) => ({
        id: getUniqueIdFromScript(script),
        columns: {
            name: script.name,
            securityGroupName: script.securityGroupName,
            description: script.version.description,
            version: (script.version.number).toString(),
            labels: {
                value: script.labels.length,
                tooltip: script.labels.length > 0 && (
                    <Typography variant="body2" component="div">
                        <OrderedList
                            items={script.labels.map((label) => ({
                                content: `${label.name}:${label.value}`,
                            }))}
                        />
                    </Typography>
                ),
                includesFilterValues: script.labels.map((item) => item.name),
            },
        },
    }));
}

export default observe<TProps>([
    StateChangeNotification.DESIGN_SCRIPTS_LIST,
    StateChangeNotification.DESIGN_SCRIPTS_DETAIL,
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.LIST_FILTER_SCRIPTS,
], ScriptsOverview);
