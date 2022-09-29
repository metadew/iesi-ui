import { isAfter, isBefore, isSameDay } from 'date-fns';

export function isDateBeforeOrEqual(date: Date, otherDate: Date) {
    return isBefore(date, otherDate) || isSameDay(date, otherDate);
}

export function isDateAfterOrEqual(date: Date, otherDate: Date) {
    return isAfter(date, otherDate) || isSameDay(date, otherDate);
}
