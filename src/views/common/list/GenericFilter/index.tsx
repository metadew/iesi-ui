import React, { useState, ReactText } from 'react';
import {
    Box,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    makeStyles,
    Typography,
    Chip,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import {
    IFilter,
    FilterConfig,
    IFilterConfigItem,
    FilterType,
    IListItem,
    ListFilters,
} from 'models/list.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import Search from './Search';
import Select from './Select';

interface IPublicProps<ColumnNames> {
    filterConfig: FilterConfig<ColumnNames>;
    onFilterChange: (listFilters: ListFilters<ColumnNames>) => void;
    listItems: IListItem<ColumnNames>[];
}

const useStyles = makeStyles(({ spacing }) => ({
    title: {
        marginBottom: spacing(2),
    },
    chip: {
        marginRight: spacing(1),
        marginBottom: spacing(1),
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

interface ISingleFilterValue {
    value: ReactText;
    columnName: string;
}

function GenericFilter<ColumnNames>({
    filterConfig,
    onFilterChange,
    listItems,
}: IPublicProps<ColumnNames>) {
    const [filters, setFilters] = useState(getIntialFiltersFromFilterConfig(filterConfig));
    const classes = useStyles();

    return (
        <Box>
            <Box marginBottom={3}>
                <Typography variant="h4" className={classes.title}>
                    <Translate msg="common.list.filter.header" />
                </Typography>
                <Box>
                    {getAllFilterValuesFromFilters().map((item) => (
                        <Chip
                            key={`${item.value}${item.columnName}`}
                            label={item.value}
                            onDelete={() => clearFilter(item)}
                            variant="outlined"
                            className={classes.chip}
                        />
                    ))}
                </Box>
            </Box>
            {Object.keys(filterConfig).map((untypedColumnName) => {
                const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
                const configItem = filterConfig[columnName] as IFilterConfigItem;

                return (
                    <ExpansionPanel key={untypedColumnName} className={classes.expansionPanel}>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMore />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            className={classes.expansionPanelSummary}
                        >
                            <Typography className={classes.expansionPanelLabel}>{configItem.label}</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails className={classes.expansionPanelDetail}>
                            {configItem.filterType === FilterType.Search && (
                                <Search
                                    onFilter={onFilter}
                                    columnName={columnName as string}
                                    filter={filters[columnName] as IFilter}
                                />
                            )}
                            {configItem.filterType === FilterType.Select && (
                                <Select
                                    onFilter={onFilter}
                                    columnName={columnName as string}
                                    listItems={listItems}
                                    filter={filters[columnName] as IFilter}
                                />
                            )}

                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                );
            })}
        </Box>
    );

    function clearFilter(singleFilterValue: ISingleFilterValue) {
        const newFilters = Object.keys(filters).reduce((acc, untypedColumnName) => {
            const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
            const filter = filters[columnName] as IFilter<ColumnNames>;

            const newFilterValues = filters[columnName].values;

            if (filter.name === singleFilterValue.columnName) {
                if (filter.values.includes(singleFilterValue.value)) {
                    const indexOfValue = filter.values.indexOf(singleFilterValue.value);
                    filter.values.splice(indexOfValue, 1);
                }
            }
            acc[columnName] = {
                ...filters[columnName],
                values: newFilterValues,
            };
            return acc;
        }, {} as ListFilters<ColumnNames>);

        setFilters(newFilters);
        onFilterChange(newFilters);
    }

    function onFilter(filter: IFilter<Partial<ColumnNames>>) {
        const newFilters = { ...filters };
        newFilters[filter.name] = {
            ...newFilters[filter.name],
            values: filter.values,
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    }

    function getAllFilterValuesFromFilters(): ISingleFilterValue[] {
        return Object.keys(filters).reduce(
            (acc, columnName) => {
                const filter = filters[columnName as keyof ColumnNames];
                filter.values.forEach((value) => {
                    if (value) {
                        const singleFilter: ISingleFilterValue = {
                            columnName,
                            value,
                        };
                        acc.push(singleFilter);
                    }
                });
                return acc;
            },
            [],
        );
    }
}

export default GenericFilter;
