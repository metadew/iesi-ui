import {
    FilterConfig,
    ListFilters,
    IFilterConfigItem,
    IListItem,
    IFilter,
    FilterType,
} from 'models/list.models';
import { TObjectWithProps } from 'models/core.models';
import { getListItemValueFromColumn } from './list';

export function getIntialFiltersFromFilterActions<ColumnNames>(
    filterActions: FilterConfig<ColumnNames>,
): ListFilters<ColumnNames> {
    return Object.keys(filterActions).reduce((acc, untypedColumnName) => {
        const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
        const filterAction = filterActions[columnName] as IFilterConfigItem;
        acc[columnName] = {
            value: '',
            name: columnName,
            filterType: filterAction.filterType,
        };
        return acc;
    }, {} as ListFilters<ColumnNames>);
}

export function filterListItems<LI extends IListItem<TObjectWithProps>>(
    items: LI[],
    filters: ListFilters<TObjectWithProps>,
): LI[] {
    return items.filter((item) => {
        const columnNames = Object.keys(filters);

        for (let i = 0; i < columnNames.length; i++) {
            const columnName = columnNames[i];
            const filter = filters[columnName];
            if (filter.value && filter.name === columnName) {
                if (filter.filterType === FilterType.Search) {
                    if (!searchFilter({ item, filter, columnName })) {
                        return false;
                    }
                }
                const itemValue = getListItemValueFromColumn(item, columnName);
                if (
                    !itemValue
                        .toString()
                        .toLowerCase()
                        .includes(filter.value.toString().toLowerCase())
                ) {
                    return false;
                }
            }
        }
        return true;
    });

    function searchFilter({
        item,
        filter,
        columnName,
    }: {
        item: LI;
        filter: IFilter<TObjectWithProps>;
        columnName: string;
    }) {
        const itemValue = getListItemValueFromColumn(item, columnName);
        return itemValue
            .toString()
            .toLowerCase()
            .includes(filter.value.toString().toLowerCase());
    }
}
