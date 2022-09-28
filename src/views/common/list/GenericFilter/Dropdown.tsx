import React, { ChangeEvent } from 'react';
import { Box, FormControl, InputLabel, makeStyles, MenuItem, Select } from '@material-ui/core';
import { FilterType, IFilter } from 'models/list.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IObserveProps, observe } from 'views/observe';
import { IState, StateChangeNotification } from 'models/state.models';

interface IPublicProps {
    columnName: string;
    onFilter: (filter: IFilter) => void;
    filter: IFilter;
    getDropdownOptions: (state: IState) => string[];
}

const useStyles = makeStyles(({ spacing }) => ({
    formControl: {
        width: '100%',
        marginBottom: spacing(2),
    },
}));

function Dropdown({
    columnName,
    onFilter,
    filter,
    getDropdownOptions,
    state,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();

    const uniqueValues = getDropdownOptions(state);

    return (
        <Box width="100%">
            <FormControl
                variant="filled"
                size="small"
                className={classes.formControl}
            >
                <InputLabel id={`dropdown-${filter.name}-label`}>
                    <Translate msg="common.list.filter.dropdown" />
                </InputLabel>
                <Select
                    labelId={`dropdown-${filter.name}-label`}
                    id={`dropdown-${filter.name}`}
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

export default observe<IPublicProps>(
    [StateChangeNotification.ENVIRONMENTS],
    Dropdown,
);
