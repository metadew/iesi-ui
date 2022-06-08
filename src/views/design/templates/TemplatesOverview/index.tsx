import React from 'react';
import { Box, Button, createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { IObserveProps, observe } from 'views/observe';
import { getTemplatesListFilter } from 'state/ui/selectors';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import { ITemplate, ITemplateColumnNames } from 'models/state/templates.model';
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
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import {
    getAsyncTemplates,
    getAsyncTemplatesEntity,
    getAsyncTemplatesPageData,
} from 'state/entities/templates/selectors';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { setTemplatesListFilter } from 'state/ui/actions';
import { StateChangeNotification } from 'models/state.models';
import { triggerFetchTemplates } from 'state/entities/templates/triggers';
import { getTranslator } from 'state/i18n/selectors';
import { getUniqueIdFromTemplate } from 'utils/templates/templateUtils';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import GenericSort from 'views/common/list/GenericSort';
import { AddRounded, Edit } from '@material-ui/icons';
import { redirectTo, ROUTE_KEYS } from 'views/routes';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import ContentWithSlideoutPanel from 'views/common/layout/ContentWithSlideoutPanel';
import GenericFilter from 'views/common/list/GenericFilter';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import GenericList from 'views/common/list/GenericList';
import { Alert } from '@material-ui/lab';

const styles = ({ palette, typography }: Theme) => createStyles({
    header: {
        backgroundColor: palette.background.paper,
        borderBottom: '1px solid',
        borderBottomColor: palette.grey[200],
    },
    templateName: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    templateDescription: {
        fontWeight: typography.fontWeightBold,
        fontSize: typography.pxToRem(12),
    },
    templateVersion: {
        fontWeight: typography.fontWeightBold,
    },
    templateMatcherCount: {
        fontWeight: typography.fontWeightBold,
    },
});

const filterConfig: FilterConfig<Partial<ITemplateColumnNames>> = {
    name: {
        label: <Translate msg="templates.overview.list.filter.template_name" />,
        filterType: FilterType.Search,
    },
};

const defaultSortedColumn: ISortedColumn<ITemplateColumnNames> = {
    name: 'name',
    sortOrder: SortOrder.Descending,
    sortType: SortType.String,
};

const sortActions: SortActions<Partial<ITemplateColumnNames>> = {
    name: {
        label: <Translate msg="templates.overview.list.sort.template_name" />,
        sortType: SortType.String,
    },
};

interface ITemplateState {
    templateIdToDelete: string;
}

type TProps = WithStyles<typeof styles>;

const TemplatesOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, ITemplateState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                templateIdToDelete: null,
            };
        }

        public componentDidMount() {
            const { dispatch } = this.props;
            const initialFilters = this.combineFiltersFromUrlAndCurrentFilters();

            this.fetchTemplatesWithFilterAndPagination({ newListFilters: initialFilters, newPage: 1 });
            dispatch(setTemplatesListFilter({ filters: initialFilters }));
        }

        render() {
            const { classes, state } = this.props;
            const pageData = getAsyncTemplatesPageData(state);
            const filterFromState = getTemplatesListFilter(state);
            const templates = getAsyncTemplates(state);
            const listItems = mapTemplatesToListItems(templates);

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
                                        msg="templates.overview.header.amount"
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
                                        checkAuthority(state, SECURITY_PRIVILEGES.S_TEMPLATES_WRITE) && (
                                            <Box display="flex" alignItems="center" flex="0 0 auto">
                                                <Box flex="0 0 auto">
                                                    <Button
                                                        variant="contained"
                                                        color="secondary"
                                                        size="small"
                                                        startIcon={<AddRounded />}
                                                        onClick={() => {
                                                            redirectTo({ routeKey: ROUTE_KEYS.R_TEMPLATE_NEW });
                                                        }}
                                                    >
                                                        <Translate msg="templates.overview.header.add_button" />
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
                                ) && (filterFromState.filters.name.values.length > 0)
                            }
                        />
                    </Box>
                </>
            );
        }

        private renderPanel({ listItems }: { listItems: IListItem<ITemplateColumnNames>[] }) {
            const { state } = this.props;
            const filterFromState = getTemplatesListFilter(state);

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

        private renderContent({ listItems }: { listItems: IListItem<ITemplateColumnNames>[] }) {
            const { classes, state, dispatch } = this.props;
            const translator = getTranslator(state);
            const asyncTemplatesEntity = getAsyncTemplatesEntity(state);
            const templatesFetchData = asyncTemplatesEntity.fetch;
            const isFetching = templatesFetchData.status === AsyncStatus.Busy;
            const hasError = templatesFetchData.status === AsyncStatus.Error;
            const templatesData = asyncTemplatesEntity.data;
            const pageData = templatesData ? templatesData.page : null;

            const columns: ListColumns<ITemplateColumnNames> = {
                name: {
                    label: <Translate msg="templates.overview.list.labels.name" />,
                    className: classes.templateName,
                    fixedWidth: '35%',
                },
                description: {
                    label: <Translate msg="templates.overview.list.labels.description" />,
                    className: classes.templateDescription,
                    fixedWidth: '55%',
                },
                version: {
                    label: <Translate msg="templates.overview.list.labels.version" />,
                    className: classes.templateVersion,
                    fixedWidth: '5%',
                },
                matchers: {
                    label: <Translate msg="templates.overview.list.labels.matchers" />,
                    className: classes.templateMatcherCount,
                    fixedWidth: '5%',
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
                                            this.fetchTemplatesWithFilterAndPagination({ newPage: page });
                                            dispatch(setTemplatesListFilter({ page }));
                                        },
                                    }}
                                    listActions={[].concat({
                                        icon: <Edit />,
                                        label: translator('templates.overview.list.actions.edit'),
                                        onClick: (id: string) => {
                                            const templates = getAsyncTemplates(state);
                                            const selectedTemplate = templates.find((item) =>
                                                getUniqueIdFromTemplate(item) === id);
                                            redirectTo({
                                                routeKey: ROUTE_KEYS.R_TEMPLATE_DETAIL,
                                                params: {
                                                    name: selectedTemplate.name,
                                                    version: selectedTemplate.version,
                                                },
                                            });
                                        },
                                        hideAction: () => !checkAuthority(state, SECURITY_PRIVILEGES.S_TEMPLATES_WRITE),
                                    })}
                                />
                            ) : (
                                <Box padding={2}>
                                    <Alert severity="error">
                                        <Translate msg="templates.overview.list.fetch_error" />
                                    </Alert>
                                </Box>
                            )
                        }
                    </Box>
                </>
            );
        }

        private onFilter(listFilters: ListFilters<Partial<ITemplateColumnNames>>) {
            const { dispatch } = this.props;
            this.fetchTemplatesWithFilterAndPagination({ newListFilters: listFilters });
            dispatch(setTemplatesListFilter({ filters: listFilters }));
        }

        private onSort(sortedColumn: ISortedColumn<ITemplateColumnNames>) {
            const { dispatch } = this.props;
            this.fetchTemplatesWithFilterAndPagination({ newSortedColumn: sortedColumn });
            dispatch(setTemplatesListFilter({ sortedColumn }));
        }

        private fetchTemplatesWithFilterAndPagination({
            newPage,
            newListFilters,
            newSortedColumn,
        }: {
            newPage?: number;
            newListFilters?: ListFilters<Partial<ITemplateColumnNames>>;
            newOnlyShowLatestVersion?: boolean;
            newSortedColumn?: ISortedColumn<ITemplateColumnNames>;
        }) {
            const { state } = this.props;
            const pageData = getAsyncTemplatesPageData(state);
            const filterFromState = getTemplatesListFilter(state);

            const filters = newListFilters || filterFromState.filters;
            const page = newListFilters ? 1 : newPage || pageData.number;
            const sortedColumn = newSortedColumn || filterFromState.sortedColumn || defaultSortedColumn;

            triggerFetchTemplates({
                pagination: { page },
                filter: {
                    name: filters.name.values.length > 0
                        && filters.name.values[0].toString(),
                },
                sort: formatSortQueryParameter(sortedColumn),
            });
        }

        private combineFiltersFromUrlAndCurrentFilters() {
            const { state } = this.props;
            const filterFromState = getTemplatesListFilter(state);
            const searchParams = new URLSearchParams(window.location.search);
            const defaultFilters = filterFromState.filters || getIntialFiltersFromFilterConfig(filterConfig);
            const hasValidUrlParams = Array.from(searchParams.keys()).some((r) =>
                Object.keys(filterConfig).includes(r));

            if (hasValidUrlParams) {
                const filterByUrlSearchParams = getIntialFiltersFromFilterConfig(filterConfig);
                Array.from(searchParams.keys()).forEach((searchParamKey: string) => {
                    if (Object.keys(filterConfig).includes(searchParamKey)) {
                        const filterValue = searchParams.get(searchParamKey);
                        if (
                            !filterByUrlSearchParams[searchParamKey as keyof ITemplateColumnNames]
                        ) {
                            filterByUrlSearchParams[searchParamKey as keyof ITemplateColumnNames]
                                .values.push(filterValue);
                        }
                    }
                });
                return filterByUrlSearchParams;
            }
            return defaultFilters;
        }
    },
);

function mapTemplatesToListItems(templates: ITemplate[]): IListItem<ITemplateColumnNames>[] {
    return templates.map((template) => ({
        id: getUniqueIdFromTemplate(template),
        columns: {
            name: template.name,
            description: template.description,
            version: template.version,
            matchers: template.matchers.length,
        },
    }));
}

export default observe<TProps>([
    StateChangeNotification.TEMPLATES,
], TemplatesOverview);
