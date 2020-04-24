/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-explicit-any */
import isSet from '@snipsonian/core/es/is/isSet';

type TComparer<ToBeCompared> = (a: ToBeCompared, b: ToBeCompared) => -1 | 0 | 1;

/**
 * If the compare should be done by ignoring case, then these functions
 * expect the input values all to be already in aither lower or upper case.
 */

export function stringComparerAscending(a: string, b: string) {
    const x = a || '';
    const y = b || '';

    return anyComparerAscending(x, y);
}

export function numberComparerAscending(a: number, b: number) {
    const x = isSet(a) ? a : NaN;
    const y = isSet(b) ? b : NaN;

    if (isNaN(x)) {
        if (isNaN(y)) {
            return 0;
        }
        return -1;
    }
    if (isNaN(y)) {
        return 1;
    }

    return anyComparerAscending(x, y);
}

function anyComparerAscending(x: any, y: any) {
    return x < y
        ? -1
        : x > y
            ? 1
            : 0;
}

/**
 * Will first compare the first part, then the second (if any), etc.
 */
export function partsComparer<ToBeCompared>(
    a: ToBeCompared[],
    b: ToBeCompared[],
    comparer: TComparer<ToBeCompared>,
) {
    return comparePartsRecursive(a, b, comparer, 0);
}

function comparePartsRecursive<ToBeCompared>(
    a: ToBeCompared[],
    b: ToBeCompared[],
    comparer: TComparer<ToBeCompared>,
    index: number,
): any {
    const compared = comparer(a[index], b[index]);

    if (compared !== 0) {
        return compared;
    }

    if (index >= a.length || index >= b.length) {
        return numberComparerAscending(a.length, b.length);
    }

    return comparePartsRecursive(a, b, comparer, index + 1);
}
