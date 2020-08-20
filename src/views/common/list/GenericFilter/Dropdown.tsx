import React, { ChangeEvent } from 'react';
import {
    makeStyles,
    FormControl,
    Box,
    InputLabel,
    MenuItem,
    Select,
} from '@material-ui/core';
import { IFilter, IListItem, FilterType } from 'models/list.models';
import { TObjectWithProps } from 'models/core.models';
import { getUniqueValuesFromListItems } from 'utils/list/list';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

interface IPublicProps {
    columnName: string;
    onFilter: (filter: IFilter) => void;
    listItems: IListItem<TObjectWithProps>[];
    filter: IFilter;
}

const useStyles = makeStyles(({ spacing }) => ({
    formControl: {
        width: '100%',
        marginBottom: spacing(2),
    },
}));

export default function Dropdown({
    listItems,
    columnName,
    onFilter,
    filter,
}: IPublicProps) {
    const classes = useStyles();

    const uniqueValues = getUniqueValuesFromListItems(listItems, columnName);

    return (
        <Box width="100%">
            <FormControl
                variant="filled"
                size="small"
                className={classes.formControl}
            >
                <InputLabel id="test">
                    <Translate msg="test" />
                </InputLabel>
                <Select
                    labelId="test"
                    id="test-select"
                    disableUnderline
                    value={filter.values[0] || ''}
                    onChange={(event: ChangeEvent<{ value: unknown }>) => {
                        const newValue = event.target.value as string;
                        onFilter({
                            name: columnName,
                            filterType: FilterType.Dropdown,
                            values: [newValue],
                        });
                    }}
                >
                    {uniqueValues.map((value) => (
                        <MenuItem
                            key={value}
                            value={value}
                        >
                            {value}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
