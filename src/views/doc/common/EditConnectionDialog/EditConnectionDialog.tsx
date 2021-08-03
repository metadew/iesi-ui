import React from 'react';
import { IConnection } from 'models/state/connections.model';
import { observe } from 'views/observe';
import { StateChangeNotification } from 'models/state.models';
/*
import React, { useEffect, useState } from 'react';
import {
    Button,
    Box,
    makeStyles,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    ButtonGroup,
    Theme,
    Paper,
} from '@material-ui/core';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import { IObserveProps, observe } from 'views/observe';
import { IConnection } from 'models/state/connections.model';
import { getAsyncEnvironments } from 'state/entities/environments/selectors';
import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import Loader from 'views/common/waiting/Loader';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { triggerFetchEnvironments } from 'state/entities/environments/triggers';
import { editConnection } from 'state/ui/actions';
import { StateChangeNotification } from 'models/state.models';

const useStyles = makeStyles(({ palette }: Theme) => ({
    textField: {
        marginTop: 0,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
    },
    paperInput: {
        marginTop: 4,
        marginBottom: 4,
    },
    descriptionTextField: {
        whiteSpace: 'pre-line',
    },
    select: {
        alignSelf: 'flex-start',
        width: '100%',
        marginTop: 4,
        marginBottom: 4,
    },
    footer: {
        width: '100%',
        marginTop: 8,
        marginbottom: 4,
    },
}));
*/

interface IPublicProps {
    open: boolean;
    onClose: () => void;
    connection: IConnection | undefined;
}

function EditConnectionDialog() {
    return (
        <></>
    );
    /*
    const classes = useStyles();
    const translator = getTranslator(state);
    const environments = getAsyncEnvironments(state).data;
    const environmentsAsyncInfo = entitiesStateManager.getAsyncEntity({
        asyncEntityKey: ASYNC_ENTITY_KEYS.environments,
    }).fetch;
    const [parameters, setParameters] = useState(connection.parameters);
    const [name, setName] = useState(connection.name);
    const [description, setDescription] = useState(connection.description);
    const [environment, setEnvironment] = useState(connection.environment);

    const connectionTypes = getAsyncConnectionTypes(state).data || [];
    const matchingConnectionTypes = connectionTypes.find((item) => item.type === 'http');

    // Trigger Fetch envs on open dialog
    useEffect(() => {
        if (open) {
            triggerFetchEnvironments();
        } else {
            // Reset form & async status
        }
        return () => { };
    }, [open]);

    if (!connection) return <></>;

    const onValidateClick = () => {
        dispatch(editConnection({
            currentConnection: connection,
            newConnection: {
                type: connection.type,
                name,
                description,
                environment,
                parameters,
                isHandled: connection.isHandled,
            },
        }));
        onClose();
    };

    return (
        <ClosableDialog
            onClose={onClose}
            open={open}
            title={translator('doc.dialog.edit.connection.title')}
            maxWidth="lg"
        >
            <Loader show={environmentsAsyncInfo.status === AsyncStatus.Busy} />
            <Box marginX="auto" width="100%">
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    width="100%"
                >
                    <Box marginBottom={2} width="100%">
                        <FormControl className={classes.select}>
                            <InputLabel id="connection-environment-label">Environment</InputLabel>
                            <Select
                                labelId="connection-environment-label"
                                id="connection-environment"
                                defaultValue={environment}
                                onBlur={(e) => setEnvironment(e.target.value)}
                            >
                                <MenuItem value={environment}>
                                    {environment}
                                </MenuItem>
                                {environments && environments.map((env) => (
                                    <MenuItem
                                        key={JSON.stringify(env.name)}
                                        value={env.name}
                                    >
                                        {env.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <Box marginBottom={2} width="100%">
                        <Paper className={classes.paperInput}>
                            <TextInput
                                id="connection-name"
                                label={translator('doc.dialog.edit.connection.name')}
                                defaultValue={name}
                                onBlur={(e) => setName(e.target.value)}
                                className={classes.textField}
                                fullWidth
                            />
                        </Paper>
                        <Paper className={classes.paperInput}>
                            <TextInput
                                id="connection-description"
                                label={translator('doc.dialog.edit.connection.description')}
                                defaultValue={description}
                                onBlur={(e) => setDescription(e.target.value)}
                                className={classNames(classes.textField, classes.descriptionTextField)}
                                rows={20}
                                multiline
                                fullWidth
                            />
                        </Paper>
                    </Box>
                    {
                        matchingConnectionTypes.parameters.map((constantParameter) => {
                            const parameter = parameters.find((p) => p.name === constantParameter.name);
                            return (
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
                            msg="doc.dialog.edit.connection.footer.cancel"
                        />
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={onValidateClick}
                    >
                        <Translate
                            msg="doc.dialog.edit.connection.footer.save"
                        />
                    </Button>
                </ButtonGroup>
            </Box>
        </ClosableDialog>

    );
    */
}

export default observe<IPublicProps>([
    StateChangeNotification.ENVIRONMENTS,
    StateChangeNotification.CONSTANTS_CONNECTION_TYPES,
], EditConnectionDialog);
