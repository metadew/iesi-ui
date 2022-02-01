import React, { useState, useEffect } from 'react';
import { Autocomplete, AutocompleteProps } from '@material-ui/lab';
import { ICustomAsyncEntity } from 'models/state.models';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { TextField } from '@material-ui/core';


interface IPublicProps<T, E> {
    triggerFunc: (...args: any[]) => boolean
    canTrigger: boolean;
    entity: ICustomAsyncEntity<E>
    inputLabel: string;
    onChange: (value: T) => void;
}

function AsynchronousAutocomplete<T extends {}, E extends {}>({
    options,
    triggerFunc,
    canTrigger,
    entity,
    inputLabel,
    onChange,
    ...props
}: AutocompleteProps<T> & IPublicProps<T, E>) {
    const [input, setInput] = useState('');
    const [value, setValue] = useState<(typeof options) extends readonly (infer T)[] ? T : never>(undefined);
    const loading = entity.fetch.status === AsyncStatus.Busy;

    useEffect(() => {
        if (canTrigger) {
            triggerFunc();
        }
    }, [canTrigger, input])

    const handleChange = (_: React.ChangeEvent<{}>, value: (typeof options) extends readonly (infer T)[] ? T : never) => {
        onChange(value);
    };

    return (
        <Autocomplete
            {...props}
            options={options}
            loading={loading}
            onInputChange={(_, newValue) => setInput(newValue)}
            onChange={handleChange}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={inputLabel}
                    variant="outlined"
                />
            )}
            freeSolo
        />
    );
}

export default AsynchronousAutocomplete;