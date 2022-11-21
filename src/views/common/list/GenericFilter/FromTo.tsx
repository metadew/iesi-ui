import React, { useState } from 'react';
import { Box, Icon, InputAdornment, makeStyles } from '@material-ui/core';
import { EventRounded, TodayRounded } from '@material-ui/icons';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { FilterType, IFilter } from 'models/list.models';
import DateFnsUtils from '@date-io/date-fns';
import { TObjectWithProps } from 'models/core.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

interface IPublicProps {
    columnName: string;
    onFilter: (filter: IFilter<TObjectWithProps>) => void;
    filter: IFilter<TObjectWithProps>;
}

const useStyles = makeStyles(() => ({
    datepicker: {
        width: '100%',
    },
}));

export default function FromTo({
    columnName,
    filter,
    onFilter,
}: IPublicProps) {
    const classes = useStyles();

    const [isFromOpen, setIsFromOpen] = useState(false);
    const [isToOpen, setIsToOpen] = useState(false);

    const fromDate = filter.values[0] ? new Date(filter.values[0]) : null;
    const toDate = filter.values[1] ? new Date(filter.values[1]) : null;

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Box>
                <DatePicker
                    autoOk
                    open={isFromOpen}
                    onOpen={() => setIsFromOpen(true)}
                    onClose={() => setIsFromOpen(false)}
                    className={classes.datepicker}
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="dense"
                    size="small"
                    label={<Translate msg="common.list.filter.from" />}
                    value={fromDate}
                    onChange={(date: Date | null) => {
                        const newDate = date ? date.toISOString() : '';
                        onFilter({
                            filterType: FilterType.FromTo,
                            name: columnName,
                            values: [newDate, filter.values[1]],
                        });
                    }}
                    maxDate={toDate || undefined}
                    fullWidth
                    inputVariant="filled"
                    InputProps={{
                        disableUnderline: true,
                        endAdornment: (
                            <InputAdornment position="end">
                                <Icon>
                                    <TodayRounded />
                                </Icon>
                            </InputAdornment>
                        ),
                    }}
                />
                <DatePicker
                    autoOk
                    open={isToOpen}
                    onOpen={() => setIsToOpen(true)}
                    onClose={() => setIsToOpen(false)}
                    className={classes.datepicker}
                    disableToolbar
                    variant="inline"
                    format="MM/dd/yyyy"
                    margin="dense"
                    size="small"
                    label={<Translate msg="common.list.filter.to" />}
                    value={filter.values[1] ? new Date(filter.values[1]) : null}
                    onChange={(date: Date | null) => {
                        const newDate = date ? date.toISOString() : '';
                        onFilter({
                            filterType: FilterType.FromTo,
                            name: columnName,
                            values: [filter.values[0], newDate],
                        });
                    }}
                    minDate={fromDate || undefined}
                    fullWidth
                    inputVariant="filled"
                    InputProps={{
                        disableUnderline: true,
                        endAdornment: (
                            <InputAdornment position="end">
                                <Icon>
                                    <EventRounded />
                                </Icon>
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
        </MuiPickersUtilsProvider>
    );
}
