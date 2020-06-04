import { IListItem, IListItemValueWithSortValue } from 'models/list.models';
import isObject from '@snipsonian/core/es/is/isObject';
import { ReactText, ReactNode } from 'react';

export function getListItemValueFromColumn<ColumnNames>(
    item: IListItem<ColumnNames>,
    columnName: keyof ColumnNames,
) {
    let value: ReactText = '';
    if (isObject(item.columns[columnName])) {
        const columnData = item.columns[columnName] as IListItemValueWithSortValue;
        value = columnData.value;
    } else {
        value = item.columns[columnName] as ReactText;
    }
    return value || '';
}

export function getListItemSortValueFromColumn<ColumnNames>(
    item: IListItem<ColumnNames>,
    columnName: keyof ColumnNames,
) {
    let value: ReactText = '';
    if (isObject(item.columns[columnName])) {
        const columnData = item.columns[columnName] as IListItemValueWithSortValue;
        value = columnData.sortValue;
    } else {
        value = item.columns[columnName] as ReactText;
    }
    return value || '';
}

export function getListItemTooltipFromColumn<ColumnNames>(
    item: IListItem<ColumnNames>,
    columnName: keyof ColumnNames,
) {
    let tooltip: string | ReactNode = null;
    if (isObject(item.columns[columnName])) {
        const columnData = item.columns[columnName] as IListItemValueWithSortValue;
        tooltip = columnData.tooltip;
    }
    return tooltip || '';
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
