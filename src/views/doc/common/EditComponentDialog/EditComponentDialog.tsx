import React, { useState } from 'react';
import {
    Button,
    Box,
    makeStyles,
    ButtonGroup,
    Paper,
    Theme,
} from '@material-ui/core';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import { IObserveProps, observe } from 'views/observe';
import { editComponent } from 'state/ui/actions';
import { StateChangeNotification } from 'models/state.models';
import { IComponent } from 'models/state/components.model';
import { getAsyncComponentTypes } from 'state/entities/constants/selectors';
import ExpandableParameter from 'views/design/ScriptDetail/EditAction/ExpandableParameter';
import TextInput from 'views/common/input/TextInput';

const useStyles = makeStyles(({ palette }: Theme) => ({
    content: {
        width: '600px',
    },
    paperInput: {
        maringTop: 4,
        marginBottom: 4,
    },
    textField: {
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
    },
    select: {
        alignSelf: 'flex-start',
        width: '100%',
    },
    footer: {
        marginTop: 8,
        marginbottom: 4,
    },
}));

interface IPublicProps {
    open: boolean;
    onClose: () => void;
    component: IComponent | undefined;
}

function EditComponentDialog({ onClose, open, state, dispatch, component }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const [parameters, setParameters] = useState(component.parameters);
    const [name, setName] = useState(component.name);
    const [description, setDescription] = useState(component.description);
    const [version, setVersion] = useState(component.version.number);
    const [versionDescription, setVersionDescription] = useState(component.version.description);
    const componentTypes = getAsyncComponentTypes(state).data || [];
    const matchingComponentTypes = componentTypes.find((item) => item.type === 'http.request');

    if (!component) return <></>;

    const onValidateClick = () => {
        dispatch(editComponent({
            currentComponent: component,
            newComponent: {
                name,
                type: component.type,
                description,
                version: {
                    number: version,
                    description: versionDescription,
                },
                parameters,
                attributes: [],
                isHandled: component.isHandled,
            },
        }));
        onClose();
    };

    return (
        <ClosableDialog
            onClose={onClose}
            open={open}
            title={translator('doc.dialog.edit.component.title')}
            contentClassName={classes.content}
            maxWidth="lg"
        >
            <Box marginX="auto" width="100%">
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                >
                    <Box marginBottom={2} width="100%">
                        <Paper className={classes.paperInput}>
                            <TextInput
                                variant="filled"
                                defaultValue={name}
                                label={translator('doc.dialog.edit.component.name')}
                                fullWidth
                                onBlur={(e) => setName(e.target.value)}
                                className={classes.textField}
                            />
                        </Paper>
                        <Paper className={classes.paperInput}>
                            <TextInput
                                variant="filled"
                                defaultValue={description}
                                label={translator('doc.dialog.edit.component.description')}
                                fullWidth
                                onBlur={(e) => setDescription(e.target.value)}
                                className={classes.textField}
                            />
                        </Paper>
                    </Box>
                    <Box marginBottom={2} width="100%">
                        <Paper className={classes.paperInput}>
                            <TextInput
                                variant="filled"
                                defaultValue={version}
                                label={translator('doc.dialog.edit.component.versionNumber')}
                                fullWidth
                                onBlur={(e) => setVersion(parseFloat(e.target.value))}
                                className={classes.textField}
                            />
                        </Paper>
                        <Paper className={classes.paperInput}>
                            <TextInput
                                variant="filled"
                                defaultValue={versionDescription}
                                label={translator('doc.dialog.edit.component.versionDescription')}
                                fullWidth
                                onBlur={(e) => setVersionDescription(e.target.value)}
                                className={classes.textField}
                            />
                        </Paper>
                    </Box>
                    {
                        matchingComponentTypes.parameters.map((constantParameter) => {
                            const parameter = parameters.find((p) => p.name === constantParameter.name);
                            return parameter && (
                                <ExpandableParameter
                                    key={constantParameter.name}
                                    onChange={(value) => {
                                        const index = parameters.findIndex((p) => p.name === constantParameter.name);
                                        const newParameters = [...parameters];
                                        if (index === -1) {
                                            newParameters.push({
                                                name: constantParameter.name,
                                                value,
                                            });
                                        } else {
                                            newParameters[index].value = value;
                                        }
                                        setParameters(newParameters);
                                    }}
                                    parameter={parameter}
                                    constantParameter={constantParameter}
                                />
                            );
                        })
                    }
                </Box>
            </Box>
            <Box display="flex" width="100%" justifyContent="flex-end" className={classes.footer}>
                <ButtonGroup size="small">
                    <Button
                        variant="outlined"
                        color="default"
                        size="small"
                        onClick={onClose}
                    >
                        <Translate
                            msg="doc.dialog.edit.component.footer.cancel"
                        />
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={onValidateClick}
                    >
                        <Translate
                            msg="doc.dialog.edit.component.footer.save"
                        />
                    </Button>
                </ButtonGroup>
            </Box>
        </ClosableDialog>

    );
}

export default observe<IPublicProps>([StateChangeNotification.ENVIRONMENTS], EditComponentDialog);