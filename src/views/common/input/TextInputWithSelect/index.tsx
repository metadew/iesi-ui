import React, { ReactNode } from 'react';
import {
    makeStyles,
    Box,
    InputBase,
    fade,
    FormControl,
    FormHelperText,
    InputBaseProps,
    Select,
    SelectProps,
    MenuItem,
} from '@material-ui/core';

interface IPublicProps {
    inputProps: Omit<InputBaseProps, 'id'> & { id: string };
    selectProps: Omit<SelectProps, 'id'> & { id: string };
    selectOptions: {
        value: string | string[] | number;
        displayValue?: string | string[] | number;
    }[];
    errorMessage?: string | ReactNode;
}

const useStyles = makeStyles(({ palette, shape, spacing, typography }) => ({
    root: {
    },
    textInput: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        backgroundColor: palette.type === 'light'
            ? fade(palette.common.black, 0.09)
            : fade(palette.common.white, 0.09),
        borderRadius: shape.borderRadius,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        '& > .MuiInputBase-input': {
            padding: spacing(1.2),
            fontWeight: typography.fontWeightBold,
            fontSize: typography.pxToRem(14),
        },
    },
    button: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    errorMessage: {
        marginLeft: spacing(0.4),
    },
}));

export default function TextInputWithButton(props: IPublicProps) {
    const classes = useStyles();
    const { inputProps, selectProps, selectOptions, errorMessage } = props;

    return (
        <FormControl margin="dense" fullWidth>
            <Box
                display="flex"
                justifyItems="stretch"
                className={classes.root}
                flexWrap="wrap"
            >
                <Box flex="1 1 auto">
                    <InputBase
                        autoComplete="off"
                        className={classes.textInput}
                        fullWidth
                        {...inputProps}
                    />
                </Box>
                <Box flex="0 0 auto">
                    <FormControl variant="filled" fullWidth required size="small">
                        <Select
                            fullWidth
                            {...selectProps}
                        >
                            {selectOptions.map((option) => (
                                <MenuItem
                                    key={JSON.stringify(option.value)}
                                    value={option.value}
                                >
                                    {option.displayValue || option.value}
                                </MenuItem>
                            ))}
                        </Select>

                    </FormControl>
                </Box>
            </Box>
            {errorMessage && (
                <FormHelperText error className={classes.errorMessage}>
                    error message
                </FormHelperText>
            )}
        </FormControl>
    );
}
