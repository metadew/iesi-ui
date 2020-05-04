import { ReactText, ReactNode } from 'react';
import { TTranslatorComponent } from './i18n.models';
import { TObjectWithProps } from './core.models';

export interface IColumn<ColumnNames> {
    label?: TTranslatorComponent;
    align?: 'left' | 'center' | 'right';
    className?: string | ((value: ReactText) => string);
}

export type ListColumns<ColumnNames> = {
    [key in keyof ColumnNames]: IColumn<ColumnNames>
};

export interface IListAction {
    icon: ReactNode;
    onClick: (id: ReactText) => void;
}

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
    label: TTranslatorComponent;
    sortType: SortType;
}

export type SortActions<ColumnNames> = {
    [key in keyof ColumnNames]: ISortAction<ColumnNames>
};

export enum FilterType {
    Search = 'search',
    Select = 'select',
}

export interface IFilter<ColumnNames = TObjectWithProps> {
    name: keyof ColumnNames;
    values: ReactText[];
    filterType: FilterType;
}

export type ListFilters<ColumnNames> = {
    [key in keyof ColumnNames]: IFilter<ColumnNames>
};

export interface IFilterConfigItem {
    label: TTranslatorComponent;
    filterType: FilterType;
}

export type FilterConfig<ColumnNames> = {
    [key in keyof ColumnNames]: IFilterConfigItem;
};
