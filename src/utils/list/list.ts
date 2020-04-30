import { IListItem, IListItemValueWithSortValue } from 'models/list.models';
import isObject from '@snipsonian/core/es/is/isObject';
import { ReactText } from 'react';

export function getListItemValueFromColumn<ColumnNames>(item: IListItem<ColumnNames>, columnName: keyof ColumnNames) {
    let value: ReactText = '';
    if (isObject(item.columns[columnName])) {
        const columnData = item.columns[columnName] as IListItemValueWithSortValue;
        value = columnData.value;
    } else {
        value = item.columns[columnName] as ReactText;
    }
    return value;
}
