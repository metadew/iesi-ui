import React, { useState, useEffect } from 'react';
import {
    InputLabel,
    FormControl,
    FilledInput,
    FilledInputProps,
    Box,
    makeStyles,
} from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IFilter, FilterType } from 'models/list.models';

const useStyles = makeStyles(({ spacing }) => ({
    keyInput: {
        marginBottom: spacing(1),
    },
}));

interface IPublicProps {
    columnName: string;
    onFilter: (filter: IFilter) => void;
    filter: IFilter;
    inputProps?: FilledInputProps;
}

export default function KeyValue({
    columnName,
    onFilter,
    filter,
    inputProps,
}: IPublicProps) {
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const classes = useStyles();

    useEffect(setFilterIfKeyValueIsFilled, [key, value]);

    return (
        <Box>
            <FormControl
                key={`keyvalue-filter-key-${columnName}`}
                variant="filled"
                fullWidth
                className={classes.keyInput}
            >
                <InputLabel>
                    <Translate msg="common.list.filter.key_value.key" />
                </InputLabel>
                <FilledInput
                    id={`keyvalue-key-${columnName}`}
                    type="text"
                    value={key || ''}
                    onChange={(e) => {
                        setKey(e.target.value);
                    }}
                    error={!key && !!value}
                    {...inputProps}
                />
            </FormControl>
            <FormControl
                key={`keyvalue-filter-value-${columnName}`}
                variant="filled"
                fullWidth
            >
                <InputLabel>
                    <Translate msg="common.list.filter.key_value.value" />
                </InputLabel>
                <FilledInput
                    id={`keyvalue-value-${columnName}`}
                    type="text"
                    value={value || ''}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    error={!!key && !value}
                    {...inputProps}
                />
            </FormControl>
        </Box>
    );

    function setFilterIfKeyValueIsFilled() {
        if (key && value) {
            onFilter({
                values: [`${key}:${value}`],
                name: columnName,
                filterType: FilterType.KeyValue,
            });
        } else if (filter.values.length > 0) {
            onFilter({
                values: [],
                name: columnName,
                filterType: FilterType.KeyValue,
            });
        }
    }
}
