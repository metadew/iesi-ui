import React, { ChangeEvent, ReactNode, useState } from 'react';
import { Box, Button, FilledInput, FormControl, FormHelperText, InputBaseProps, makeStyles } from '@material-ui/core';

interface IPublicProps {
    inputProps: Omit<InputBaseProps, 'id'> & { id: string };
    buttonText: string | ReactNode;
    errorMessage?: string | ReactNode;
    onSubmit: (value: string) => void;
}

const useStyles = makeStyles(({ shape, spacing, typography }) => ({
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
    const { inputProps, buttonText, onSubmit, errorMessage } = props;

    const [input, setInput] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.currentTarget.value);
    };

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
                        onChange={handleInputChange}
                    />
                </Box>
                <Box flex="0 0 auto">
                    <Button
                        variant="contained"
                        color="secondary"
                        disableElevation
                        className={classes.button}
                        onClick={() => onSubmit(input)}
                    >
                        {buttonText}
                    </Button>
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
