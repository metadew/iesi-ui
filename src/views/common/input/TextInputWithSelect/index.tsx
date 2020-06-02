import React, { ReactNode } from 'react';
import {
    makeStyles,
    Box,
    fade,
    FormControl,
    FormHelperText,
    InputBaseProps,
    Select,
    SelectProps,
    MenuItem,
    FilledInput,
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
        borderRadius: shape.borderRadius,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        '& > .MuiInputBase-input': {
            padding: `${spacing(1.6)}px ${spacing(1.2)}px`,
            fontWeight: typography.fontWeightBold,
            fontSize: typography.pxToRem(14),
            textAlign: 'right',
        },
    },
    select: {
        '& > .MuiFilledInput-root': {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            backgroundColor: palette.type === 'light'
                ? fade(palette.common.black, 0.07)
                : fade(palette.common.white, 0.13),
            fontWeight: typography.fontWeightBold,
            '& > .MuiSelect-select': {
                paddingTop: spacing(1.5),
                paddingBottom: spacing(1.5),
            },
        },
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
            >
                <Box flex="1 1 auto">
                    <FilledInput
                        autoComplete="off"
                        className={classes.textInput}
                        fullWidth
                        disableUnderline
                        {...inputProps}
                    />
                </Box>
                <Box flex="0 0 auto" minWidth={105}>
                    <FormControl variant="filled" required fullWidth size="small" className={classes.select}>
                        <Select
                            disableUnderline
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
