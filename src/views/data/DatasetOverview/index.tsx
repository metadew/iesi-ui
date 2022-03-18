import React, { ReactText } from 'react';
import {
    Box,
    Button,
    createStyles,
    Theme,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import { observe, IObserveProps } from 'views/observe';
import { getDatasetsListFilter } from 'state/ui/selectors';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
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
import { IDataset, IDatasetColumnNames } from 'models/state/datasets.model';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import {
    getAsyncDatasetDetail,
    getAsyncDatasetDetailImport,
    getAsyncDatasets,
    getAsyncDatasetsEntitty,
    getAsyncDatasetsPageData,
} from 'state/entities/datasets/selectors';
import {
    triggerDeleteDatasetDetail,
    triggerFetchDatasets,
    triggerImportDatasetDetail,
} from 'state/entities/datasets/triggers';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { setDatasetsListFilter } from 'state/ui/actions';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import GenericSort from 'views/common/list/GenericSort';
import { checkAuthority, checkAuthorityGeneral } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import { AddRounded, Delete, Edit, Visibility } from '@material-ui/icons';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import ContentWithSlideoutPanel from 'views/common/layout/ContentWithSlideoutPanel';
import GenericFilter from 'views/common/list/GenericFilter';
import { getTranslator } from 'state/i18n/selectors';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import GenericList from 'views/common/list/GenericList';
import { getUniqueIdFromDataset } from 'utils/datasets/datasetUtils';
import { StateChangeNotification } from 'models/state.models';
import { Alert } from '@material-ui/lab';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import ImportDatasetDialog from './ImportDatasetDialog';

const styles = ({ palette, typography }: Theme) => createStyles({
    header: {
        backgroundColor: palette.background.paper,
        borderBottom: '1px solid',
        borderBottomColor: palette.grey[200],
    },
    datasetName: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    securityGroupName: {
        fontWeight: typography.fontWeightBold,
        fontSize: typography.pxToRem(12),
    },
    implementations: {
        fontWeight: typography.fontWeightBold,
    },
});

const filterConfig: FilterConfig<Partial<IDatasetColumnNames>> = {
    name: {
        label: <Translate msg="datasets.overview.list.filter.dataset_name" />,
        filterType: FilterType.Search,
    },
};

const defaultSortedColumn: ISortedColumn<IDatasetColumnNames> = {
    name: 'name',
    sortOrder: SortOrder.Descending,
    sortType: SortType.String,
};

const sortActions: SortActions<Partial<IDatasetColumnNames>> = {
    name: {
        label: <Translate msg="datasets.overview.list.sort.dataset_name" />,
        sortType: SortType.String,
    },
};

interface IDatasetState {
    datasetIdToDelete: string;
    importDatasetDialogOpen: boolean;
}

type TProps = WithStyles<typeof styles>;

const DatasetOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IDatasetState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                datasetIdToDelete: null,
                importDatasetDialogOpen: false,
            };

            this.renderPanel = this.renderPanel.bind(this);

            this.combineFiltersFromUrlAndCurrentFilters = this.combineFiltersFromUrlAndCurrentFilters.bind(this);
            this.fetchDatasetsWithFilterAndPagination = this.fetchDatasetsWithFilterAndPagination.bind(this);
            this.onSort = this.onSort.bind(this);
            this.onFilter = this.onFilter.bind(this);

            this.setDatasetToDelete = this.setDatasetToDelete.bind(this);
            this.onDeleteDataset = this.onDeleteDataset.bind(this);
            this.onImportDatasetDialogClose = this.onImportDatasetDialogClose.bind(this);
            this.onImportDatasetDialogOpen = this.onImportDatasetDialogOpen.bind(this);
            // eslint-disable-next-line max-len
            this.closeDeleteDeleteDialogAfterSuccessfulDelete = this.closeDeleteDeleteDialogAfterSuccessfulDelete.bind(this);
            // eslint-disable-next-line max-len
            this.closeImportDatasetDIalogAfterSuccessfulCreate = this.closeImportDatasetDIalogAfterSuccessfulCreate.bind(this);
        }

        public componentDidMount() {
            const { dispatch } = this.props;
            const initialFilters = this.combineFiltersFromUrlAndCurrentFilters();

            this.fetchDatasetsWithFilterAndPagination({ newListFilters: initialFilters, newPage: 1 });
            dispatch(setDatasetsListFilter({ filters: initialFilters }));
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            const { state, dispatch } = prevProps;
            const filterFromState = getDatasetsListFilter(state);

            if (filterFromState.filters === null || filterFromState.sortedColumn === null) {
                dispatch(setDatasetsListFilter({
                    filters: filterFromState.filters === null && getIntialFiltersFromFilterConfig(filterConfig),
                    sortedColumn: filterFromState.sortedColumn === null && {
                        name: 'name',
                        sortOrder: SortOrder.Ascending,
                        sortType: SortType.String,
                    },
                }));
            }
            this.closeDeleteDeleteDialogAfterSuccessfulDelete(prevProps);
            this.closeImportDatasetDIalogAfterSuccessfulCreate(prevProps);
        }

        public render() {
            const { classes, state } = this.props;
            const { datasetIdToDelete, importDatasetDialogOpen } = this.state;
            const translator = getTranslator(state);
            const pageData = getAsyncDatasetsPageData(this.props.state);
            const filterFromState = getDatasetsListFilter(state);
            const datasets = getAsyncDatasets(state);
            const listItems = mapDatasetsToListItems(datasets);
            const deleteStatus = getAsyncDatasetDetail(this.props.state).remove.status;
            const importStatus = getAsyncDatasetDetailImport(this.props.state).create.status;

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
                                        msg="datasets.overview.header.amount"
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
                                    {
                                        checkAuthorityGeneral(state, SECURITY_PRIVILEGES.S_DATASETS_WRITE) && (
                                            <Box display="flex" alignItems="center" flex="0 0 auto">
                                                <Box flex="0 0 auto" mr="16px">
                                                    <ImportDatasetDialog
                                                        open={importDatasetDialogOpen}
                                                        onOpen={this.onImportDatasetDialogOpen}
                                                        onClose={this.onImportDatasetDialogClose}
                                                        onImport={(dataset) => triggerImportDatasetDetail(dataset)}
                                                        showLoader={importStatus === AsyncStatus.Busy}
                                                    />
                                                </Box>
                                                <Box flex="0 0 auto">
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        startIcon={<AddRounded />}
                                                        onClick={() => {
                                                            redirectTo({ routeKey: ROUTE_KEYS.R_DATASET_NEW });
                                                        }}
                                                    >
                                                        <Translate msg="datasets.overview.header.add_button" />
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )
                                    }
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
                                    && (filterFromState.filters.name.values.length > 0))
                            }
                        />
                        <ConfirmationDialog
                            title={translator('datasets.overview.delete_dataset_dialog.title')}
                            text={translator('datasets.overview.delete_dataset_dialog.text')}
                            open={!!datasetIdToDelete}
                            onClose={() => this.setState({ datasetIdToDelete: null })}
                            onConfirm={this.onDeleteDataset}
                            showLoader={deleteStatus === AsyncStatus.Busy}
                        />
                    </Box>
                </>
            );
        }

        private renderPanel({ listItems }: { listItems: IListItem<IDatasetColumnNames>[] }) {
            const { state } = this.props;
            const filterFromState = getDatasetsListFilter(state);

            return (
                <>
                    <GenericFilter
                        filterConfig={filterConfig}
                        onFilterChange={this.onFilter}
                        listItems={listItems}
                        initialFilters={filterFromState.filters}
                    />
                </>
            );
        }

        private renderContent({ listItems }: { listItems: IListItem<IDatasetColumnNames>[] }) {
            const { classes, state, dispatch } = this.props;
            const translator = getTranslator(state);
            const asyncDatasetsEntity = getAsyncDatasetsEntitty(state);
            const datasetsFetchData = asyncDatasetsEntity.fetch;
            const isFetching = datasetsFetchData.status === AsyncStatus.Busy;
            const hasError = datasetsFetchData.status === AsyncStatus.Error;
            const datasetsData = asyncDatasetsEntity.data;
            const pageData = datasetsData ? datasetsData.page : null;

            const columns: ListColumns<IDatasetColumnNames> = {
                name: {
                    label: <Translate msg="datasets.overview.list.labels.name" />,
                    className: classes.datasetName,
                    fixedWidth: '70%',
                },
                securityGroupName: {
                    label: <Translate msg="datasets.overview.list.labels.security_group" />,
                    className: classes.securityGroupName,
                    fixedWidth: '20%',
                },
                implementations: {
                    label: <Translate msg="datasets.overview.list.labels.implementations" />,
                    className: classes.implementations,
                    fixedWidth: '10%',
                },
            };

            return (
                <>
                    <Box paddingBottom={5} marginX={2.8}>
                        {
                            !hasError ? (
                                <GenericList
                                    columns={columns}
                                    listItems={listItems}
                                    isLoading={isFetching}
                                    pagination={{
                                        pageData,
                                        onChange: ({ page }) => {
                                            this.fetchDatasetsWithFilterAndPagination({ newPage: page });
                                            dispatch(setDatasetsListFilter({ page }));
                                        },
                                    }}
                                    listActions={[].concat({
                                        icon: <Edit />,
                                        label: translator('datasets.overview.list.actions.edit'),
                                        onClick: (id: string) => {
                                            const datasets = getAsyncDatasets(state);
                                            const selectedDataset = datasets.find((item) =>
                                                getUniqueIdFromDataset(item) === id);
                                            redirectTo({
                                                routeKey: ROUTE_KEYS.R_DATASET_DETAIL,
                                                params: {
                                                    name: selectedDataset.name,
                                                },
                                            });
                                        },
                                        hideAction: (item: IListItem<IDatasetColumnNames>) => (
                                            !checkAuthority(
                                                state,
                                                SECURITY_PRIVILEGES.S_DATASETS_WRITE,
                                                item.columns.securityGroupName.toString(),
                                            )
                                        ),
                                    }, {
                                        icon: <Visibility />,
                                        label: translator('datasets.overview.list.actions.view'),
                                        onClick: (id: string) => {
                                            const datasets = getAsyncDatasets(state);
                                            const selectedDataset = datasets.find((item) =>
                                                getUniqueIdFromDataset(item) === id);
                                            redirectTo({
                                                routeKey: ROUTE_KEYS.R_DATASET_DETAIL,
                                                params: {
                                                    name: selectedDataset.name,
                                                },
                                            });
                                        },
                                        hideAction: (item: IListItem<IDatasetColumnNames>) => (
                                            checkAuthority(
                                                state,
                                                SECURITY_PRIVILEGES.S_DATASETS_WRITE,
                                                item.columns.securityGroupName.toString(),
                                            )
                                        ),
                                    }, {
                                        icon: <Delete />,
                                        label: translator('datasets.overview.list.actions.delete'),
                                        onClick: this.setDatasetToDelete,
                                        hideAction: (item: IListItem<IDatasetColumnNames>) => (
                                            !checkAuthority(
                                                state,
                                                SECURITY_PRIVILEGES.S_DATASETS_WRITE,
                                                item.columns.securityGroupName.toString(),
                                            )),
                                    })}
                                />
                            ) : (
                                <Box padding={2}>
                                    <Alert severity="error">
                                        <Translate msg="datasets.overview.list.fetch_error" />
                                    </Alert>
                                </Box>
                            )
                        }
                    </Box>
                </>
            );
        }

        private closeImportDatasetDIalogAfterSuccessfulCreate(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncDatasetDetailImport(this.props.state).create;
            const prevStatus = getAsyncDatasetDetailImport(prevProps.state).create.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.setState({ importDatasetDialogOpen: false });
                this.fetchDatasetsWithFilterAndPagination({});
            }
        }

        private onImportDatasetDialogOpen() {
            this.setState({ importDatasetDialogOpen: true });
        }

        private onImportDatasetDialogClose() {
            this.setState({ importDatasetDialogOpen: false });
        }

        private closeDeleteDeleteDialogAfterSuccessfulDelete(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncDatasetDetail(this.props.state).remove;
            const prevStatus = getAsyncDatasetDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.setState({ datasetIdToDelete: null });
                this.fetchDatasetsWithFilterAndPagination({});
            }
        }

        private setDatasetToDelete(id: ReactText) {
            this.setState({ datasetIdToDelete: id as string });
        }

        private onFilter(listFilters: ListFilters<Partial<IDatasetColumnNames>>) {
            const { dispatch } = this.props;
            this.fetchDatasetsWithFilterAndPagination({ newListFilters: listFilters });
            dispatch(setDatasetsListFilter({ filters: listFilters }));
        }

        private combineFiltersFromUrlAndCurrentFilters() {
            const { state } = this.props;
            const filterFromState = getDatasetsListFilter(state);
            const searchParams = new URLSearchParams(window.location.search);
            const defaultFilters = filterFromState.filters || getIntialFiltersFromFilterConfig(filterConfig);
            const hasValidUrlParams = Array.from(searchParams.keys()).some((r) =>
                Object.keys(filterConfig).includes(r));
            if (hasValidUrlParams) {
                const filtersByUrlSearchParams = getIntialFiltersFromFilterConfig(filterConfig);
                Array.from(searchParams.keys()).forEach(
                    (searchParamKey: string) => {
                        if (Object.keys(filterConfig).includes(searchParamKey)) {
                            const filterValue = searchParams.get(searchParamKey);
                            if (
                                !filtersByUrlSearchParams[searchParamKey as keyof IDatasetColumnNames]
                                    .values.includes(filterValue)
                            ) {
                                filtersByUrlSearchParams[searchParamKey as keyof IDatasetColumnNames]
                                    .values.push(filterValue);
                            }
                        }
                    },
                );
                return filtersByUrlSearchParams;
            }
            return defaultFilters;
        }

        private onDeleteDataset() {
            const { state } = this.props;
            const { datasetIdToDelete } = this.state;
            const datasetToDelete = getAsyncDatasets(state).find((item) =>
                getUniqueIdFromDataset(item) === datasetIdToDelete);

            if (datasetToDelete) {
                triggerDeleteDatasetDetail({ uuid: datasetToDelete.uuid });
            }
        }

        private onSort(sortedColumn: ISortedColumn<IDatasetColumnNames>) {
            const { dispatch } = this.props;
            this.fetchDatasetsWithFilterAndPagination({ newSortedColumn: sortedColumn });
            dispatch(setDatasetsListFilter({ sortedColumn }));
        }

        private fetchDatasetsWithFilterAndPagination({
            newPage,
            newListFilters,
            newSortedColumn,
        }: {
            newPage?: number;
            newListFilters?: ListFilters<Partial<IDatasetColumnNames>>;
            newOnlyShowLatestVersion?: boolean;
            newSortedColumn?: ISortedColumn<IDatasetColumnNames>;
        }) {
            const { state } = this.props;
            const pageData = getAsyncDatasetsPageData(this.props.state);

            const filtersFromState = getDatasetsListFilter(state);

            const filters = newListFilters || filtersFromState.filters;
            const page = newListFilters ? 1 : newPage || pageData.number;
            const sortedColumn = newSortedColumn || filtersFromState.sortedColumn || defaultSortedColumn;

            triggerFetchDatasets({
                pagination: { page },
                filter: {
                    name: filters.name.values.length > 0
                        && filters.name.values[0].toString(),
                },
                sort: formatSortQueryParameter(sortedColumn),
            });
        }
    },
);

function mapDatasetsToListItems(datasets: IDataset[]): IListItem<IDatasetColumnNames>[] {
    return datasets.map((dataset) => ({
        id: getUniqueIdFromDataset(dataset),
        columns: {
            name: dataset.name,
            securityGroupName: dataset.securityGroupName,
            implementations: dataset.implementations.length,
        },
    }));
}

export default observe<TProps>([
    StateChangeNotification.DATA_DATASETS_LIST,
    StateChangeNotification.DATA_DATASETS_DETAIL,
    StateChangeNotification.LIST_FILTER_DATASETS,
], DatasetOverview);
