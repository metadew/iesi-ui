import {
    FilterConfig,
    ListFilters,
    IFilterConfigItem,
    IListItem,
    IFilter,
    FilterType,
} from 'models/list.models';
import { TObjectWithProps } from 'models/core.models';
import { ReactText } from 'react';
import { getListItemValueFromColumn } from './list';

export function getIntialFiltersFromFilterConfig<ColumnNames>(
    filterConfig: FilterConfig<ColumnNames>,
): ListFilters<ColumnNames> {
    return Object.keys(filterConfig).reduce((acc, untypedColumnName) => {
        const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
        const filterAction = filterConfig[columnName] as IFilterConfigItem;
        acc[columnName] = {
            values: [],
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
            if (filter.values && filter.values.length > 0 && filter.name === columnName) {
                if (
                    filter.filterType === FilterType.Search
                    || filter.filterType === FilterType.Select
                ) {
                    if (!stringMatchFilter({ item, filter, columnName })) {
                        return false;
                    }
                }
            }
        }
        return true;
    });

    function stringMatchFilter({
        item,
        filter,
        columnName,
    }: {
        item: LI;
        filter: IFilter<TObjectWithProps>;
        columnName: string;
    }) {
        const itemValue = getListItemValueFromColumn(item, columnName);
        let match = false;
        filter.values.forEach((value) => {
            if (reactTextIncludesValue(itemValue, value)) {
                match = true;
            }
        });
        return match;
    }
}

export function reactTextIncludesValue(reactText: ReactText, value: ReactText) {
    return reactText
        .toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase());
}
