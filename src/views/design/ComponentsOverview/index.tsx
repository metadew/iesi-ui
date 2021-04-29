import React, { ReactText } from 'react';
import { IObserveProps, observe } from 'views/observe';
import GenericFilter from 'views/common/list/GenericFilter';
import { Box, Button, Theme, Typography, WithStyles, withStyles, createStyles } from '@material-ui/core';
import { AddRounded, Delete, Edit } from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { checkAuthorityGeneral, SECURITY_PRIVILEGES } from 'views/appShell/AppLogIn/components/AuthorithiesChecker';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import { getComponentsListFilter } from 'state/ui/selectors';
import GenericSort from 'views/common/list/GenericSort';
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
import ContentWithSlideoutPanel from 'views/common/layout/ContentWithSlideoutPanel';
import { IComponent, IComponentColumnNamesBase } from 'models/state/components.model';
import GenericList from 'views/common/list/GenericList';
import { getTranslator } from 'state/i18n/selectors';
import { setComponentsListFilter } from 'state/ui/actions';
import {
    getAsyncComponents,
    getAsyncComponentsEntity,
    getAsyncComponentsPageData,
    getAsyncComponentDetail,
} from 'state/entities/components/selectors';
import { getUniqueIdFromComponent } from 'utils/components/componentUtils';
import { StateChangeNotification } from 'models/state.models';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { triggerDeleteComponentDetail, triggerFetchComponents } from 'state/entities/components/triggers';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';
import TransformDocumentationDialog from '../common/TransformDocumentationDialog';

const styles = ({ palette, typography }: Theme) =>
    createStyles({
        header: {
            backgroundColor: palette.background.paper,
            borderBottom: '1px solid',
            borderBottomColor: palette.grey[200],
        },
        componentName: {
            fontWeight: typography.fontWeightBold,
            color: palette.primary.main,
        },
        componentType: {
            fontWeight: typography.fontWeightBold,
        },
        componentVersion: {
            fontWeight: typography.fontWeightBold,
        },
        componentDescription: {
            fontWeight: typography.fontWeightBold,
            fontSize: typography.pxToRem(12),
        },
    });

const filterConfig: FilterConfig<Partial<IComponentColumnNamesBase>> = {
    name: {
        label: <Translate msg="components.overview.list.filter.component_name" />,
        filterType: FilterType.Search,
    },
};
const sortActions: SortActions<Partial<IComponentColumnNamesBase>> = {
    name: {
        label: <Translate msg="components.overview.list.sort.component_name" />,
        sortType: SortType.String,
    },
};
interface IComponentState {
    componentIdToDelete: string;
    loadDocDialogOpen: boolean;
}
type TProps = WithStyles<typeof styles>;

const ComponentsOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                componentIdToDelete: null,
                loadDocDialogOpen: false,
            };

            this.renderPanel = this.renderPanel.bind(this);
            this.renderContent = this.renderContent.bind(this);
            this.setComponentToDelete = this.setComponentToDelete.bind(this);
            this.clearComponentToDelete = this.clearComponentToDelete.bind(this);
            this.onDeleteComponent = this.onDeleteComponent.bind(this);
            // eslint-disable-next-line max-len
            this.closeDeleteComponentDialogAfterSuccessfulDelete = this.closeDeleteComponentDialogAfterSuccessfulDelete.bind(this);
            this.onFilter = this.onFilter.bind(this);
            this.fetchComponentsWithFilterAndPagination = this.fetchComponentsWithFilterAndPagination.bind(this);
            this.onLoadDocDialogOpen = this.onLoadDocDialogOpen.bind(this);
            this.onLoadDocDialogClose = this.onLoadDocDialogClose.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            const { state, dispatch } = prevProps;
            const filterFromState = getComponentsListFilter(state);
            if (filterFromState.filters === null || filterFromState.sortedColumn === null) {
                dispatch(setComponentsListFilter({
                    filters: filterFromState.filters === null && getIntialFiltersFromFilterConfig(filterConfig),
                    sortedColumn: filterFromState.sortedColumn === null && {
                        name: 'name',
                        sortOrder: SortOrder.Ascending,
                        sortType: SortType.String,
                    },
                }));
            }
            this.closeDeleteComponentDialogAfterSuccessfulDelete(prevProps);
        }

        public render() {
            const { classes, state } = this.props;
            const { componentIdToDelete } = this.state;
            const filterFromState = getComponentsListFilter(state);
            const components = getAsyncComponents(this.props.state);
            const pageData = getAsyncComponentsPageData(this.props.state);
            const listItems = mapComponentsToListItems(components);
            const translator = getTranslator(state);
            const deleteStatus = getAsyncComponentDetail(state).remove.status;
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
                                        msg="components.overview.header.amount"
                                        placeholders={{ amount: pageData ? pageData.totalElements : 0 }}
                                    />
                                </Typography>
                                <Box display="flex" alignItems="flex-end">
                                    <Box flex="1 0 auto">
                                        <GenericSort
                                            sortActions={sortActions}
                                            onSort={() => { }}
                                            sortedColumn={undefined}
                                        />
                                    </Box>
                                    {
                                        checkAuthorityGeneral(SECURITY_PRIVILEGES.S_COMPONENTS_WRITE)
                                        && (
                                            <Box display="flex" alignItems="center">
                                                <Box flex="0 0 auto" mr="8px" width="250px">
                                                    <TransformDocumentationDialog
                                                        open={this.state.loadDocDialogOpen}
                                                        onOpen={this.onLoadDocDialogOpen}
                                                        onClose={this.onLoadDocDialogClose}
                                                    />
                                                </Box>
                                                <Box flex="0 0 auto">
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        startIcon={<AddRounded />}
                                                        onClick={() => {
                                                            redirectTo({ routeKey: ROUTE_KEYS.R_COMPONENT_NEW });
                                                        }}
                                                    >
                                                        <Translate msg="components.overview.header.add_button" />
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
                            title={translator('components.overview.delete_component_dialog.title')}
                            text={translator('components.overview.delete_component_dialog.text')}
                            open={!!componentIdToDelete}
                            onClose={this.clearComponentToDelete}
                            onConfirm={this.onDeleteComponent}
                            showLoader={deleteStatus === AsyncStatus.Busy}
                        />
                    </Box>
                </>
            );
        }

        private renderPanel({ listItems }: { listItems: IListItem<IComponentColumnNamesBase>[] }) {
            const { state } = this.props;
            const filterFromState = getComponentsListFilter(state);

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

        private renderContent({ listItems }: { listItems: IListItem<IComponentColumnNamesBase>[] }) {
            const { classes, state, dispatch } = this.props;
            const translator = getTranslator(state);
            const columns: ListColumns<IComponentColumnNamesBase> = {
                name: {
                    label: <Translate msg="components.overview.list.labels.name" />,
                    className: classes.componentName,
                    fixedWidth: '20%',
                },
                type: {
                    label: <Translate msg="components.overview.list.labels.type" />,
                    className: classes.componentType,
                    fixedWidth: '40%',
                },
                version: {
                    label: <Translate msg="components.overview.list.labels.version" />,
                    className: classes.componentVersion,
                    noWrap: true,
                    fixedWidth: '5%',
                },
                description: {
                    label: <Translate msg="components.overview.list.labels.description" />,
                    className: classes.componentDescription,
                    fixedWidth: '25%',
                    noWrap: true,
                },
            };

            const asyncComponentsEntity = getAsyncComponentsEntity(this.props.state);
            const componentsFetchData = asyncComponentsEntity.fetch;
            const isFetching = componentsFetchData.status === AsyncStatus.Busy;
            const hasError = componentsFetchData.status === AsyncStatus.Error;
            const componentsData = asyncComponentsEntity.data;
            const pageData = componentsData ? componentsData.page : null;

            return (
                <>
                    <Box paddingBottom={5} marginX={2.8}>
                        {
                            !hasError && (
                                <GenericList
                                    listActions={[].concat(
                                        {
                                            icon: <Edit />,
                                            label: translator('components.overview.list.actions.edit'),
                                            onClick: (id: string) => {
                                                const components = getAsyncComponents(this.props.state);
                                                const selectedComponent = components.find((item) =>
                                                    getUniqueIdFromComponent(item) === id);
                                                redirectTo({
                                                    routeKey: ROUTE_KEYS.R_COMPONENT_DETAIL,
                                                    params: {
                                                        name: selectedComponent.name,
                                                        version: selectedComponent.version.number,
                                                    },
                                                });
                                            },
                                        },
                                        {
                                            icon: <Delete />,
                                            label: translator('components.overview.list.actions.delete'),
                                            onClick: this.setComponentToDelete,
                                        },
                                    )}
                                    columns={columns}
                                    listItems={listItems}
                                    pagination={{
                                        pageData,
                                        onChange: ({ page }) => {
                                            this.fetchComponentsWithFilterAndPagination({ newPage: page });
                                            dispatch(setComponentsListFilter({ page }));
                                        },
                                    }}
                                    isLoading={isFetching}
                                />
                            )
                        }

                    </Box>
                </>
            );
        }

        private setComponentToDelete(id: ReactText) {
            this.setState({ componentIdToDelete: id as string });
        }

        private clearComponentToDelete() {
            this.setState({ componentIdToDelete: null });
        }

        private onDeleteComponent() {
            const { state } = this.props;
            const { componentIdToDelete } = this.state;
            const componentToDelete = getAsyncComponents(state).find((item) =>
                getUniqueIdFromComponent(item) === componentIdToDelete);

            if (componentToDelete) {
                triggerDeleteComponentDetail({
                    name: componentToDelete.name,
                    version: componentToDelete.version.number,
                });
            }
        }

        private closeDeleteComponentDialogAfterSuccessfulDelete(prevProps: TProps & IObserveProps) {
            const { status } = getAsyncComponentDetail(this.props.state).remove;
            const prevStatus = getAsyncComponentDetail(prevProps.state).remove.status;

            if (status === AsyncStatus.Success && prevStatus !== AsyncStatus.Success) {
                this.clearComponentToDelete();
                this.fetchComponentsWithFilterAndPagination({});
            }
        }

        private onFilter(listFilters: ListFilters<Partial<IComponentColumnNamesBase>>) {
            const { dispatch } = this.props;
            this.fetchComponentsWithFilterAndPagination({ newListFilters: listFilters });
            dispatch(setComponentsListFilter({ filters: listFilters }));
        }

        private onLoadDocDialogOpen() {
            this.setState((state) => ({ ...state, loadDocDialogOpen: true }));
        }

        private onLoadDocDialogClose() {
            this.setState((state) => ({ ...state, loadDocDialogOpen: false }));
        }

        private fetchComponentsWithFilterAndPagination({
            newPage,
            newListFilters,
            newSortedColumn,
        }: {
            newPage?: number;
            newListFilters?: ListFilters<Partial<IComponentColumnNamesBase>>;
            newOnlyShowLatestVersion?: boolean;
            newSortedColumn?: ISortedColumn<IComponentColumnNamesBase>;
        }) {
            const { state } = this.props;
            const pageData = getAsyncComponentsPageData(this.props.state);

            const filtersFromState = getComponentsListFilter(state);

            const filters = newListFilters || filtersFromState.filters;
            const page = newListFilters ? 1 : newPage || pageData.number;
            const sortedColumn = newSortedColumn || filtersFromState.sortedColumn;

            triggerFetchComponents({
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

function mapComponentsToListItems(components: IComponent[]): IListItem<IComponentColumnNamesBase>[] {
    return components.map((component) => ({
        id: getUniqueIdFromComponent(component),
        columns: {
            name: component.name,
            description: component.description,
            version: component.version.number,
            type: component.type,
        },
        isHandled: component.isHandled,
    }));
}

export default observe<TProps>([
    StateChangeNotification.DESIGN_COMPONENTS_LIST,
    StateChangeNotification.LIST_FILTER_COMPONENTS,
    StateChangeNotification.DESIGN_COMPONENT_DETAIL,
], ComponentsOverview);
