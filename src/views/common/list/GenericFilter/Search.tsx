import React from 'react';
import {
    InputLabel,
    FormControl,
    FilledInput,
    InputAdornment,
    Icon,
    FilledInputProps,
} from '@material-ui/core';
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
                value={filter.values[0] || ''}
                onChange={(e) => {
                    onFilter({
                        values: [e.target.value],
                        name: columnName,
                        filterType: FilterType.Search,
                    });
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
