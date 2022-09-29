import { IListItem, IListItemValueWithSortValue } from 'models/list.models';
import isObject from '@snipsonian/core/es/is/isObject';
import { ReactNode, ReactText } from 'react';

export function getListItemValueFromColumn<ColumnNames>(
    item: IListItem<ColumnNames>,
    columnName: keyof ColumnNames,
) {
    let value: ReactText = '';
    if (isObject(item.columns[columnName])) {
        const columnData = item.columns[columnName] as IListItemValueWithSortValue;
        value = columnData ? columnData.value : undefined;
    } else {
        value = item.columns[columnName] as ReactText;
    }
    return typeof value !== 'undefined' ? value : '';
}

export function getListItemSortValueFromColumn<ColumnNames>(
    item: IListItem<ColumnNames>,
    columnName: keyof ColumnNames,
) {
    let value: ReactText = '';
    if (isObject(item.columns[columnName])) {
        const columnData = item.columns[columnName] as IListItemValueWithSortValue;
        value = columnData ? columnData.sortValue : undefined;
    } else {
        value = item.columns[columnName] as ReactText;
    }
    return typeof value !== 'undefined' ? value : '';
}

export function getListItemTooltipFromColumn<ColumnNames>(
    item: IListItem<ColumnNames>,
    columnName: keyof ColumnNames,
) {
    let tooltip: string | ReactNode = null;
    if (isObject(item.columns[columnName])) {
        const columnData = item.columns[columnName] as IListItemValueWithSortValue;
        tooltip = columnData ? columnData.tooltip : undefined;
    }
    return typeof tooltip !== 'undefined' ? tooltip : '';
}

export function getUniqueValuesFromListItems<ColumnNames>(
    items: IListItem<ColumnNames>[],
    columnName: keyof ColumnNames,
): ReactText[] {
    return items.reduce(
        (acc, item) => {
            const value = getListItemValueFromColumn(item, columnName);
            if (!acc.includes(value)) {
                acc.push(value);
            }
            return acc;
        },
        [],
    );
}
