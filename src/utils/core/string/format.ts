import { ISortedColumn, SortOrder } from 'models/list.models';

export function camelCaseToSnakeCase(str: string) {
    return str.split(/(?=[A-Z])/).join('_').toLowerCase();
}

export function formatSortQueryParameter<ColumnNames>(sortedColumn: ISortedColumn<ColumnNames>) {
    // eslint-disable-next-line max-len
    return `${camelCaseToSnakeCase(sortedColumn.name.toString())},${sortedColumn.sortOrder === SortOrder.Ascending ? 'asc' : 'desc'}`;
}
