import { ReactElement, ReactText, ReactNode } from 'react';
import { TTranslatorComponent } from './i18n.models';
import { TObjectWithProps } from './core.models';
import { IState } from './state.models';

export interface IColumn<ColumnNames> {
    label?: TTranslatorComponent;
    align?: 'left' | 'center' | 'right';
    className?: string | ((value: ReactText) => string);
    tooltip?: string | ((value: ReactText) => ReactText | ReactNode);
    noWrap?: boolean;
    fixedWidth?: ReactText;
    hideOnCompactView?: boolean;
    icon?: ReactElement;
}

export type ListColumns<ColumnNames> = {
    [key in keyof ColumnNames]: IColumn<ColumnNames>
};

export interface IListAction {
    icon: ReactElement;
    label: TTranslatorComponent | string;
    onClick: (id: ReactText, index: number) => void;
}

export interface IListItemValueWithSortValue {
    value: ReactText;
    sortValue?: ReactText;
    includesFilterValues?: ReactText[];
    tooltip?: ReactText | ReactNode;
}


export interface IListItem<ColumnNames, Data = TObjectWithProps> {
    id: ReactText;
    columns: {
        [key in keyof ColumnNames]: ReactText | IListItemValueWithSortValue
    };
    data?: Data;
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
    FromTo = 'from-to',
    Includes = 'includes',
    Dropdown = 'dropdown',
    KeyValue = 'key-value',
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
    getDropdownOptions?: (state: IState) => string[];
}

export type FilterConfig<ColumnNames> = {
    [key in keyof ColumnNames]: IFilterConfigItem;
};
