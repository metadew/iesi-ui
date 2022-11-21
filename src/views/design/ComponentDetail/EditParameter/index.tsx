import React, { useState } from 'react';
import { IComponentParameter } from 'models/state/components.model';
import { TRequiredFieldsState } from 'models/form.models';
import { IObserveProps, observe } from 'views/observe';
import { Box, Button, ButtonGroup, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
import TextInput from 'views/common/input/TextInput';
import { getTranslator } from 'state/i18n/selectors';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { THEME_COLORS } from 'config/themes/colors';
import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';

interface IPublicProps {
    parameter: IComponentParameter;
    mandatory: boolean;
    onClose: () => void;
    onEdit: (parameter: IComponentParameter) => void;
    isCreateParameter?: boolean;
}

const useStyles = makeStyles(({ palette, typography }: Theme) => ({
    dialog: {
        background: palette.background.default,
    },
    header: {
        background: palette.background.paper,
    },
    index: {
        fontWeight: typography.fontWeightBold,
        textAlign: 'center',
    },
    textField: {
        marginTop: 0,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
    },
    tableCell: {
        position: 'relative',
        '&:after': {
            content: '" "',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '1px',
            backgroundColor: THEME_COLORS.GREY,
        },
    },
}));

function EditParameter({
    parameter,
    onClose,
    onEdit,
    mandatory,
    state,
    isCreateParameter,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const [parameterState, setParameterState] = useState<IComponentParameter>({
        name: parameter.name,
        value: parameter.value,
    });
    const [requiredFieldsState, setRequiredFieldsState] = useState<TRequiredFieldsState<IComponentParameter>>({
        value: {
            showError: false,
        },
    });
    const translator = getTranslator(state);

    const handleChange = (fieldToUpdate: Partial<IComponentParameter>) => {
        setParameterState((prevState) => ({
            ...prevState,
            ...fieldToUpdate,
        }));
    };

    return (
        <Box className={classes.dialog}>
            <Box
                className={classes.header}
                display="flex"
                justifyContent="center"
                alignItems="center"
                padding={2}
            >
                <Typography variant="h2">Add new parameter</Typography>
            </Box>
            <Box padding={2}>
                <Box marginBottom={2}>
                    <Paper>
                        <TextInput
                            id="parameter-name"
                            label={translator('components.detail.edit.name')}
                            defaultValue={parameterState.name}
                            onBlur={(e) => handleChange({ name: e.target.value })}
                            className={classes.textField}
                            InputProps={{
                                readOnly: mandatory,
                                disableUnderline: true,
                                autoComplete: 'off',
                            }}
                            fullWidth
                        />
                    </Paper>
                </Box>
                <Box marginBottom={2}>
                    <Paper>
                        <TextInput
                            id="parameter-value"
                            label={translator('components.detail.edit.value')}
                            defaultValue={parameterState.value}
                            onBlur={(e) => handleChange({ value: e.target.value })}
                            className={classes.textField}
                            InputProps={{
                                disableUnderline: true,
                                autoComplete: 'off',
                            }}
                            required={mandatory}
                            error={requiredFieldsState.value.showError && mandatory}
                            helperText={
                                requiredFieldsState.value.showError
                                && mandatory
                                && 'Parameter value is a required field'
                            }
                            fullWidth
                        />
                    </Paper>
                </Box>
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="center"
                    marginTop={2}
                >
                    <Box marginLeft={2}>
                        <ButtonGroup size="small">
                            <Button
                                color="default"
                                variant="outlined"
                                onClick={onClose}
                            >
                                <Translate msg="components.detail.edit.footer.cancel" />
                            </Button>
                            {
                                checkAuthority(state, SECURITY_PRIVILEGES.S_COMPONENTS_WRITE) && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={updateParameter}
                                        disableElevation
                                    >
                                        {
                                            isCreateParameter ? (
                                                <Translate msg="components.detail.edit.footer.save" />
                                            ) : (
                                                <Translate msg="components.detail.edit.footer.update" />
                                            )
                                        }
                                    </Button>
                                )
                            }
                        </ButtonGroup>
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    function updateParameter() {
        const { passed: passedRequired, requiredFieldsState: requireFields } = requiredFieldsCheck({
            data: parameterState,
            requiredFields: ['value'],
        });

        if (passedRequired) {
            onEdit(parameterState);
            onClose();
        } else {
            setRequiredFieldsState(requireFields);
        }
    }
}

export default observe<IPublicProps>([], EditParameter);
