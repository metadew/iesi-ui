import {
    FilterConfig,
    ListFilters,
    IFilterConfigItem,
    IListItem,
    IFilter,
    FilterType,
    IListItemValueWithSortValue,
} from 'models/list.models';
import { TObjectWithProps } from 'models/core.models';
import { ReactText } from 'react';
import { parseISO } from 'date-fns/esm';
import { isDateBeforeOrEqual, isDateAfterOrEqual } from 'utils/core/date/compare';
import { getListItemSortValueFromColumn } from './list';

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
                    || filter.filterType === FilterType.Dropdown
                    || filter.filterType === FilterType.KeyValue
                ) {
                    if (!stringMatchFilter({ item, filter, columnName })) {
                        return false;
                    }
                }

                if (
                    filter.filterType === FilterType.FromTo
                ) {
                    if (!fromToFilter({ item, filter, columnName })) {
                        return false;
                    }
                }

                if (
                    filter.filterType === FilterType.Includes
                ) {
                    if (!includesFilter({ item, filter, columnName })) {
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
        const itemValue = getListItemSortValueFromColumn(item, columnName);
        let match = false;
        filter.values.forEach((value) => {
            if (reactTextIncludesValue(itemValue, value)) {
                match = true;
            }
        });
        return match;
    }

    function fromToFilter({
        item,
        filter,
        columnName,
    }: {
        item: LI;
        filter: IFilter<TObjectWithProps>;
        columnName: string;
    }) {
        const itemValue = getListItemSortValueFromColumn(item, columnName);
        const itemDate = parseISO(itemValue as string);
        const startDate = filter.values[0] ? parseISO(filter.values[0] as string) : null;
        const endDate = filter.values[1] ? parseISO(filter.values[1] as string) : null;


        if (startDate && endDate) {
            return isDateAfterOrEqual(itemDate, startDate) && isDateBeforeOrEqual(itemDate, endDate);
        }
        if (startDate) {
            return isDateAfterOrEqual(itemDate, startDate);
        }
        if (endDate) {
            return isDateBeforeOrEqual(itemDate, endDate);
        }

        return true;
    }

    function includesFilter({
        item,
        filter,
        columnName,
    }: {
        item: LI;
        filter: IFilter<TObjectWithProps>;
        columnName: string;
    }) {
        const columnData = item.columns[columnName] as IListItemValueWithSortValue;
        let match = false;
        filter.values.forEach((value) => {
            columnData.includesFilterValues.forEach((itemValue) => {
                if (reactTextIncludesValue(itemValue, value)) {
                    match = true;
                }
            });
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
