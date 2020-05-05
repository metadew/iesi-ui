import React from 'react';
import { TextField, TextFieldProps } from '@material-ui/core';

export default function TextInput({
    fullWidth = true,
    margin = 'dense',
    size = 'small',
    variant = 'filled',
    InputProps = { disableUnderline: true },
    ...restProps
}: TextFieldProps) {
    return (
        <TextField
            fullWidth={fullWidth}
            margin={margin}
            size={size}
            variant={variant}
            InputProps={InputProps}
            {...restProps}
        />
    );
}
