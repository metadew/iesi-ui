import React, { useState, ReactText } from 'react';
import {
    makeStyles,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Checkbox,
    FormControl,
    Box,
    InputLabel,
    FilledInput,
    InputAdornment,
    Icon,
} from '@material-ui/core';
import { IFilter, IListItem, FilterType } from 'models/list.models';
import { Search as SearchIcon } from '@material-ui/icons';
import { TObjectWithProps } from 'models/core.models';
import { getUniqueValuesFromListItems } from 'utils/list/list';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { reactTextIncludesValue } from 'utils/list/filters';

const SHOW_FILTER_WHEN_MORE_THAN_X_OPTIONS = 5;

interface IPublicProps {
    columnName: string;
    onFilter: (filter: IFilter) => void;
    listItems: IListItem<TObjectWithProps>[];
    filter: IFilter;
}

const useStyles = makeStyles(({ spacing }) => ({
    list: {
        width: '100%',
    },
    formControl: {
        width: '100%',
        marginBottom: spacing(2),
    },
}));

export default function Select({
    listItems,
    columnName,
    onFilter,
    filter,
}: IPublicProps) {
    const [valueFilter, setValueFilter] = useState('');
    const classes = useStyles();

    const handleToggle = (value: ReactText) => {
        const currentIndex = filter.values.indexOf(value);
        const newCheckedValues = [...filter.values];

        if (currentIndex === -1) {
            newCheckedValues.push(value);
        } else {
            newCheckedValues.splice(currentIndex, 1);
        }

        onFilter({
            name: columnName,
            filterType: FilterType.Select,
            values: newCheckedValues,
        });
    };

    let uniqueValues = getUniqueValuesFromListItems(listItems, columnName);
    const showValueFilter = uniqueValues.length > SHOW_FILTER_WHEN_MORE_THAN_X_OPTIONS;
    if (showValueFilter && valueFilter) {
        uniqueValues = uniqueValues.filter((value) => reactTextIncludesValue(value, valueFilter));
    }

    return (
        <Box width="100%">
            {showValueFilter && (
                <FormControl
                    key={`value-filter-${columnName}`}
                    variant="filled"
                    className={classes.formControl}
                >
                    <InputLabel htmlFor="filled-adornment-password">
                        <Translate msg="common.list.filter.select_search" />
                    </InputLabel>
                    <FilledInput
                        id={`value-filter-input-${columnName}`}
                        type="text"
                        value={valueFilter}
                        onChange={(e) => {
                            setValueFilter(e.target.value);
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
            )}
            <List dense className={classes.list}>
                {uniqueValues.map((value) => {
                    const labelId = `checkbox-list-secondary-label-${value}`;
                    return (
                        <ListItem key={value} button>
                            <ListItemText id={labelId} primary={value} />
                            <ListItemSecondaryAction>
                                <Checkbox
                                    edge="end"
                                    onChange={() => handleToggle(value)}
                                    checked={
                                        filter.values.indexOf(value) !== -1
                                    }
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}
