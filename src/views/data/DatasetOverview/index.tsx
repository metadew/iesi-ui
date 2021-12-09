import React from 'react';
import {
    createStyles,
    Theme,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import { observe, IObserveProps } from 'views/observe';
import { getDatasetsListFilter } from 'state/ui/selectors';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import { FilterConfig, FilterType, ISortedColumn, ListFilters, SortOrder, SortType } from 'models/list.models';
import { IDatasetColumnNames } from 'models/state/datasets.model';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getAsyncDatasetsPageData } from 'state/entities/datasets/selectors';
import { triggerFetchDatasets } from 'state/entities/datasets/triggers';
import { formatSortQueryParameter } from 'utils/core/string/format';
import { setDatasetsListFilter } from 'state/ui/actions';

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

interface IDatasetState {
    datasetIdToDelete: string;
}

type TProps = WithStyles<typeof styles>;

const DatasetOverview = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IDatasetState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                datasetIdToDelete: null,
            };

            this.combineFiltersFromUrlAndCurrentFilters = this.combineFiltersFromUrlAndCurrentFilters.bind(this);
            this.fetchDatasetsWithFilterAndPagination = this.fetchDatasetsWithFilterAndPagination.bind(this);
        }

        public componentDidMount() {
            const { dispatch } = this.props;
            const initialFilters = this.combineFiltersFromUrlAndCurrentFilters();

            this.fetchDatasetsWithFilterAndPagination({ newListFilters: initialFilters, newPage: 1 });
            dispatch(setDatasetsListFilter({ filters: initialFilters }));
        }

        public render() {
            return (
                <>
                    <div>Coucou</div>
                </>
            );
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

        private fetchDatasetsWithFilterAndPagination({
            newPage,
            newListFilters,
            newSortedColumn,
        }: {
            newPage?: number;
            newListFilters: ListFilters<Partial<IDatasetColumnNames>>;
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

export default observe<TProps>([], DatasetOverview);
