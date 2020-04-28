import isString from '@snipsonian/core/es/is/isString';
import { ReactText } from 'react';
import isObject from '@snipsonian/core/es/is/isObject';
import { ISortedColumn, IListItem, SortOrder, SortType, IListItemValueWithSortValue } from 'models/list.models';
import { TObjectWithProps } from 'models/core.models';
import { stringComparerAscending, numberComparerAscending, partsComparer } from './comparerUtils';

export default function sortListItems<LI extends IListItem<TObjectWithProps>>(
    items: LI[],
    sortedColumn: ISortedColumn<TObjectWithProps>,
): LI[] {
    const ascendingComparer = getAscendingComparer(sortedColumn);

    if (!ascendingComparer) {
        // Unable to sort this, return as is
        return items;
    }

    const sortedAscending = items
        .slice()
        .sort(ascendingComparer);

    return reverseIfDescending(sortedAscending, sortedColumn.sortOrder);
}

function getAscendingComparer(
    sortedColumn: ISortedColumn<TObjectWithProps>,
) {
    switch (sortedColumn.sortType) {
        case SortType.String:
            return getAscendingComparerForStrings(sortedColumn);
        case SortType.Number:
            return getAscendingComparerForNumbers(sortedColumn);
        default:
            return getAscendingComparerForDotSeparatedNumbers(sortedColumn);
    }
}

function getAscendingComparerForStrings<LI extends IListItem<TObjectWithProps>>(
    sortedColumn: ISortedColumn<TObjectWithProps>,
) {
    return (a: LI, b: LI) => {
        const x = (getItemSortValue(a, sortedColumn.name) as string || '').toLowerCase();
        const y = (getItemSortValue(b, sortedColumn.name) as string || '').toLowerCase();

        return stringComparerAscending(x, y);
    };
}

function getAscendingComparerForNumbers<LI extends IListItem<TObjectWithProps>>(
    sortedColumn: ISortedColumn<TObjectWithProps>,
) {
    return (a: LI, b: LI) => {
        const x = getItemSortValue(a, sortedColumn.name) as number;
        const y = getItemSortValue(b, sortedColumn.name) as number;

        return numberComparerAscending(x, y);
    };
}

function getAscendingComparerForDotSeparatedNumbers<LI extends IListItem<TObjectWithProps>>(
    sortedColumn: ISortedColumn<TObjectWithProps>,
) {
    return (a: LI, b: LI) => {
        const x = getItemSortValue(a, sortedColumn.name) as string;
        const y = getItemSortValue(b, sortedColumn.name) as string;

        const xParts = splitStringToNumericParts(x, '.');
        const yParts = splitStringToNumericParts(y, '.');

        return partsComparer(xParts, yParts, numberComparerAscending);
    };
}

function reverseIfDescending<LI extends IListItem<TObjectWithProps>>(items: LI[], sortOrder: SortOrder): LI[] {
    return sortOrder === SortOrder.Descending ? items.reverse() : items;
}

function getItemSortValue<LI extends IListItem<TObjectWithProps>>(item: LI, columnName: ReactText) {
    let sortValue: ReactText = '';
    if (isObject(item.columns[columnName])) {
        const columnData = item.columns[columnName] as IListItemValueWithSortValue;
        sortValue = columnData.sortValue;
    } else {
        sortValue = item.columns[columnName] as ReactText;
    }
    return sortValue;
}

export function splitStringToNumericParts(str: string, separator: string) {
    return isString(str)
        ? str.trim()
            .toLowerCase()
            .split(separator)
            .map((strPart) => Number(strPart))
        : [null];
}
