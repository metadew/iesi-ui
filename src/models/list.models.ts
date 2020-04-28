import { ReactText, ReactElement, ReactNode } from 'react';

export enum SortOrder {
    Ascending = 'ascending',
    Descending = 'descending',
}

export enum SortType {
    String = 'string',
    Number = 'number',
    DotSeparatedNumber = 'dotSeparatedNumber',
}

export interface ISortedColumn<ColumnNames> {
    name: keyof ColumnNames;
    sortOrder: SortOrder;
    sortType: SortType;
}

export interface ISortAction<ColumnNames> {
    label: ReactElement<{
        msg: string;
        placeholders?: { [key: string]: ReactText };
    }>;
    sortType: SortType;
}

export type SortActions<ColumnNames> = {
    [key in keyof ColumnNames]: ISortAction<ColumnNames>
};

export type ListColumns<ColumnNames> = {
    [key in keyof ColumnNames]: IColumn<ColumnNames>
};

export interface IListItemValueWithSortValue {
    value: ReactText;
    sortValue: ReactText;
}


export interface IListItem<ColumnNames> {
    id: ReactText;
    columns: {
        [key in keyof ColumnNames]: ReactText | IListItemValueWithSortValue
    };
}

export interface IColumn<ColumnNames> {
    label?: ReactElement<{
        msg: string;
        placeholders?: { [key: string]: ReactText };
    }>;
    align?: 'left' | 'center' | 'right';
    className?: string | ((value: ReactText) => string);
}

export interface IListAction {
    icon: ReactNode;
    onClick: (id: ReactText) => void;
}
