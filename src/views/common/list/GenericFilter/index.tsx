import React, { useState, ReactText, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { TTranslatorComponent } from 'models/i18n.models';
import {
    Box,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    makeStyles,
    Typography,
    IconButton,
} from '@material-ui/core';
import { AddRounded, RemoveRounded } from '@material-ui/icons';
import {
    IFilter,
    FilterType,
    FilterConfig,
    ListFilters,
    IListItem,
    IFilterConfigItem,
} from 'models/list.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getIntialFiltersFromFilterConfig } from 'utils/list/filters';
import { parseISO, format as formatDate } from 'date-fns';
import isValidDate from 'utils/core/date/isValidDate';
import Search from './Search';
import Select from './Select';
import FromTo from './FromTo';
import Dropdown from './Dropdown';
import KeyValue from './KeyValue';
import RemovableChip from './RemovableChip';

interface IPublicProps<ColumnNames> {
    filterConfig: FilterConfig<ColumnNames>;
    onFilterChange: (listFilters: ListFilters<ColumnNames>) => void;
    listItems: IListItem<ColumnNames>[];
    initialFilters?: ListFilters<ColumnNames>;
}

const useStyles = makeStyles(({ spacing, palette, typography }) => ({
    title: {
        marginTop: spacing(1),
        marginBottom: spacing(1),
    },
    expansionPanelWrapper: {
        borderBottom: '2px solid',
        borderBottomColor: palette.background.default,
    },
    expansionPanel: {
        background: 'none',
        boxShadow: 'none',
        borderTop: '2px solid',
        borderTopColor: palette.background.default,
        paddingLeft: spacing(5),
        paddingRight: spacing(1.5),
        '&:before': {
            display: 'none',
        },
        '&.Mui-expanded': {
            margin: 0,
        },
    },
    expansionPanelLabel: {
        fontSize: typography.pxToRem(18),
        fontWeight: typography.fontWeightBold,
    },
    expansionPanelSummary: {
        paddingLeft: 0,
        paddingRight: 0,
        minHeight: spacing(6.2),
        '& .MuiExpansionPanelSummary-content': {
            margin: 0,
            alignItems: 'center',
        },
        '& .close-icon': {
            display: 'none',
        },
        '&.Mui-expanded': {
            minHeight: spacing(6.2),
            '& .close-icon': {
                display: 'block',
            },
            '& .open-icon': {
                display: 'none',
            },
        },
    },
    expansionPanelDetail: {
        paddingLeft: 0,
        paddingRight: spacing(3.5),
    },
}));

interface ISingleFilterValue {
    value: ReactText;
    columnName: string;
    chipLabel: TTranslatorComponent;
}

function GenericFilter<ColumnNames>({
    filterConfig,
    onFilterChange,
    listItems,
    initialFilters,
}: IPublicProps<ColumnNames>) {
    const [filters, setFilters] = useState(getIntialFiltersFromFilterConfig(filterConfig));
    const classes = useStyles();
    const [onFilterChangeDebounced] = useDebouncedCallback(onFilterChange, 500);

    useEffect(() => {
        if (initialFilters) {
            setFilters(initialFilters);
        }
    }, [initialFilters]);

    return (
        <Box>
            <Box display="flex" alignItems="center" marginTop={-3} paddingY={1} paddingX={5} minHeight={96}>
                <Box>
                    <Typography variant="h4" className={classes.title}>
                        <Translate msg="common.list.filter.header" />
                    </Typography>
                    <Box>
                        {getAllFilterValuesFromFilters().map((item, index) => {
                            const itemValue = item.value ? item.value.toString() : '';
                            const itemValueParsedAsDate = parseISO(itemValue);
                            const valueIsDate = isValidDate(itemValueParsedAsDate);
                            const formattedValue = valueIsDate
                                ? formatDate(itemValueParsedAsDate, 'dd/MM/yyyy')
                                : item.value;

                            return (
                                <RemovableChip
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={`${itemValue}${index}`}
                                    text={`${item.chipLabel ? item.chipLabel : ''}${formattedValue}`}
                                    onDelete={() => clearFilter(item)}
                                    truncateLength={30}
                                />
                            );
                        })}
                    </Box>
                </Box>
            </Box>
            <Box className={classes.expansionPanelWrapper}>
                {Object.keys(filterConfig).map((untypedColumnName) => {
                    const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
                    const configItem = filterConfig[columnName] as IFilterConfigItem;

                    return (
                        <ExpansionPanel key={untypedColumnName} className={classes.expansionPanel}>
                            <ExpansionPanelSummary
                                className={classes.expansionPanelSummary}
                                IconButtonProps={{
                                    edge: false,
                                }}
                            >
                                <Box flex="1 1 auto">
                                    <Typography className={classes.expansionPanelLabel}>{configItem.label}</Typography>
                                </Box>
                                <IconButton>
                                    <AddRounded className="open-icon" />
                                    <RemoveRounded className="close-icon" />
                                </IconButton>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.expansionPanelDetail}>
                                {(configItem.filterType === FilterType.Search
                                    || configItem.filterType === FilterType.Includes)
                                    && (
                                        <Search
                                            onFilter={onFilter}
                                            columnName={columnName as string}
                                            filter={filters[columnName] as IFilter}
                                            inputProps={{ disableUnderline: true }}
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
                                {configItem.filterType === FilterType.FromTo && (
                                    <FromTo
                                        onFilter={onFilter}
                                        columnName={columnName as string}
                                        filter={filters[columnName] as IFilter}
                                    />
                                )}
                                {configItem.filterType === FilterType.Dropdown && (
                                    <Dropdown
                                        onFilter={onFilter}
                                        columnName={columnName as string}
                                        filter={filters[columnName] as IFilter}
                                        getDropdownOptions={configItem.getDropdownOptions}
                                    />
                                )}
                                {configItem.filterType === FilterType.KeyValue && (
                                    <KeyValue
                                        onFilter={onFilter}
                                        columnName={columnName as string}
                                        filter={filters[columnName] as IFilter}
                                    />
                                )}
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    );
                })}
            </Box>
        </Box>
    );

    function clearFilter(singleFilterValue: ISingleFilterValue) {
        const newFilters = Object.keys(filters).reduce((acc, untypedColumnName) => {
            const columnName = (untypedColumnName as unknown) as keyof ColumnNames;
            const filter = filters[columnName] as IFilter<ColumnNames>;

            let newFilterValues = filters[columnName].values;

            if (filter.name === singleFilterValue.columnName) {
                newFilterValues = newFilterValues.filter((value) => value !== singleFilterValue.value);
            }

            acc[columnName] = {
                ...filters[columnName],
                values: newFilterValues,
            };
            return acc;
        }, {} as ListFilters<ColumnNames>);

        setFilters(newFilters);
        onFilterChangeDebounced(newFilters);
    }

    function onFilter(filter: IFilter<Partial<ColumnNames>>) {
        const newFilters = { ...filters };
        const values = filter.values.filter((value) => !!value);
        newFilters[filter.name] = {
            ...newFilters[filter.name],
            values,
        };
        setFilters(newFilters);
        onFilterChangeDebounced(newFilters);
    }

    function getAllFilterValuesFromFilters(): ISingleFilterValue[] {
        return Object.keys(filters).reduce(
            (acc, columnName) => {
                const filter = filters[columnName as keyof ColumnNames];
                filter.values.forEach((value, index) => {
                    if (value) {
                        let chipLabel = null;

                        if (filter.filterType === FilterType.FromTo) {
                            chipLabel = index === 0
                                ? <Translate msg="common.list.filter.chip_label.from" />
                                : <Translate msg="common.list.filter.chip_label.to" />;
                        }

                        const singleFilter: ISingleFilterValue = {
                            columnName,
                            value,
                            chipLabel,
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
