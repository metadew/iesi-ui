import React, { useState, useCallback } from 'react';
import {
    InputLabel,
    FormControl,
    FilledInput,
    InputAdornment,
    Icon,
    FilledInputProps,
} from '@material-ui/core';
import debounce from 'lodash/debounce';
import { Search as SearchIcon } from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IFilter, FilterType } from 'models/list.models';

interface IPublicProps {
    columnName: string;
    onFilter: (filter: IFilter) => void;
    filter: IFilter;
    inputProps?: FilledInputProps;
}

export default function Search({
    columnName,
    onFilter,
    filter,
    inputProps,
}: IPublicProps) {
    const [searchTerm, setSearchTerm] = useState(filter.values[0] || '');

    const debouncedHandler = (value: string) => {
        onFilter({
            values: [value],
            name: columnName,
            filterType: FilterType.Search,
        });
    };

    const delayedSearch = useCallback(debounce(debouncedHandler, 500), []);

    return (
        <FormControl
            key={`filter-${columnName}`}
            variant="filled"
            fullWidth
        >
            <InputLabel htmlFor="filled-adornment-password">
                <Translate msg="common.list.filter.search" />
            </InputLabel>
            <FilledInput
                id={`search-${columnName}`}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    delayedSearch(e.target.value);
                }}
                endAdornment={(
                    <InputAdornment position="end">
                        <Icon>
                            <SearchIcon />
                        </Icon>
                    </InputAdornment>
                )}
                {...inputProps}
            />
        </FormControl>
    );
}
