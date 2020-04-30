import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
// import classnames from 'classnames';
import {
    Box,
    FormControl,
    InputLabel,
    FilledInput,
    InputAdornment,
    Icon,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    makeStyles,
    Typography,
} from '@material-ui/core';
import { Search, ExpandMore } from '@material-ui/icons';
import {
    IFilter,
    FilterConfig,
    ListFilters,
    IFilterConfigItem,
} from 'models/list.models';
import { getIntialFiltersFromFilterActions } from 'utils/list/filters';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

interface IPublicProps<ColumnNames> {
    filterConfig: FilterConfig<ColumnNames>;
    onFilter: (filter: IFilter<ColumnNames>) => void;
}

const useStyles = makeStyles(() => ({
    formControl: {
        width: '100%',
    },
    expansionPanel: {
        background: 'none',
        boxShadow: 'none',
    },
    expansionPanelLabel: {
        fontSize: '1.25em',
    },
    expansionPanelSummary: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    expansionPanelDetail: {
        paddingLeft: 0,
        paddingRight: 0,
    },
}));

function GenericFilter<ColumnNames>({
    filterConfig,
    onFilter,
}: IPublicProps<ColumnNames>) {
    const [filtersInput, setFiltersInput] = useState<ListFilters<ColumnNames>>(
        getIntialFiltersFromFilterActions(filterConfig),
    );
    const [onFilterDebounced] = useDebouncedCallback(onFilter, 300, {
        leading: false,
    });

    const classes = useStyles();

    return (
        <Box paddingTop={3} paddingBottom={3}>
            {Object.keys(filterConfig).map((untypedColumnName) => {
                const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
                const configItem = filterConfig[
                    columnName
                ] as IFilterConfigItem;

                return (
                    <ExpansionPanel className={classes.expansionPanel}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            className={classes.expansionPanelSummary}
                        >
                            <Typography className={classes.expansionPanelLabel}>{configItem.label}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.expansionPanelDetail}>
                            <FormControl
                                key={`filter-${columnName}`}
                                variant="filled"
                                className={classes.formControl}
                            >
                                <InputLabel htmlFor="filled-adornment-password">
                                    <Translate msg="common.list.filter.search" />
                                </InputLabel>
                                <FilledInput
                                    id={`filter-${columnName}`}
                                    type="text"
                                    value={filtersInput[columnName].value}
                                    onChange={(e) =>
                                        onChange({
                                            value: e.target.value,
                                            columnName,
                                        })}
                                    endAdornment={(
                                        <InputAdornment position="end">
                                            <Icon>
                                                <Search />
                                            </Icon>
                                        </InputAdornment>
                                    )}
                                />
                            </FormControl>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                );
            })}
        </Box>
    );

    function onChange({
        value,
        columnName,
    }: {
        value: string;
        columnName: keyof ColumnNames;
    }) {
        const newInput = { ...filtersInput };
        newInput[columnName] = {
            ...newInput[columnName],
            value,
        };
        setFiltersInput(newInput);
        onFilterDebounced({
            name: columnName,
            filterType: newInput[columnName].filterType,
            value,
        });
    }
}

export default GenericFilter;
