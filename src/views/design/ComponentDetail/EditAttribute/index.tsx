import React, { useState } from 'react';
import { IComponentAttribute } from 'models/state/components.model';
import { IObserveProps, observe } from 'views/observe';
import { Box, Button, ButtonGroup, makeStyles, Paper, Theme } from '@material-ui/core';
import TextInput from 'views/common/input/TextInput';
import { getTranslator } from 'state/i18n/selectors';
import { checkAuthorityGeneral, SECURITY_PRIVILEGES } from 'views/appShell/AppLogIn/components/AuthorithiesChecker';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

interface IPublicProps {
    attribute: IComponentAttribute;
    onClose: () => void;
    onEdit: (attribute: IComponentAttribute) => void;
    isCreateAttribute?: boolean;
}

const useStyles = makeStyles(({ palette }: Theme) => ({
    dialog: {
        background: palette.background.default,
    },
    textField: {
        marginTop: 0,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
    },
}));

function EditAttribute({
    attribute,
    onClose,
    onEdit,
    state,
    isCreateAttribute,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const [name, setName] = useState(attribute.name);
    const [value, setValue] = useState(attribute.value);
    const [environment, setEnvironment] = useState(attribute.environment);
    const translator = getTranslator(state);

    return (
        <Box className={classes.dialog}>
            <Box padding={2}>
                <Box marginBottom={2}>
                    <Paper>
                        <TextInput
                            id="attribute-name"
                            label={translator('components.detail.edit.name')}
                            defaultValue={name}
                            onBlur={(e) => setName(e.target.value)}
                            className={classes.textField}
                            fullWidth
                        />
                    </Paper>
                </Box>
                <Box marginBottom={2}>
                    <Paper>
                        <TextInput
                            id="attribute-value"
                            label={translator('components.detail.edit.value')}
                            defaultValue={value}
                            onBlur={(e) => setValue(e.target.value)}
                            className={classes.textField}
                            fullWidth
                        />
                    </Paper>
                </Box>
                <Box marginBottom={2}>
                    <Paper>
                        <TextInput
                            id="attribute-environment"
                            label={translator('components.detail.edit.environment')}
                            defaultValue={environment}
                            onBlur={(e) => setEnvironment(e.target.value)}
                            className={classes.textField}
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
                                checkAuthorityGeneral(SECURITY_PRIVILEGES.S_COMPONENTS_WRITE) && (
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={updateAttribute}
                                        disableElevation
                                    >
                                        {
                                            isCreateAttribute ? (
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

    function updateAttribute() {
        onEdit({ name, value, environment });
        onClose();
    }
}

export default observe<IPublicProps>([], EditAttribute);
