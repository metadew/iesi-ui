import React from 'react';
import { InputLabel, FormControl, FilledInput, InputAdornment, Icon, makeStyles } from '@material-ui/core';
import { Search as SearchIcon } from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IFilter, FilterType } from 'models/list.models';

interface IPublicProps {
    columnName: string;
    onFilter: (filter: IFilter) => void;
    filter: IFilter;
}

const useStyles = makeStyles(() => ({
    formControl: {
        width: '100%',
    },
}));

export default function Search({
    columnName,
    onFilter,
    filter,
}: IPublicProps) {
    const classes = useStyles();

    return (
        <FormControl
            key={`filter-${columnName}`}
            variant="filled"
            className={classes.formControl}
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
            />
        </FormControl>
    );
}
