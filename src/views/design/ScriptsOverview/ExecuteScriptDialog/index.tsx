import React, { useState, useEffect } from 'react';
import {
    Button,
    Box,
    makeStyles,
    FormControl,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Paper,
    Typography,
} from '@material-ui/core';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { observe, IObserveProps } from 'views/observe';
import { getScriptByName } from 'state/entities/scripts/selectors';
import { triggerCreateExecutionRequest } from 'state/entities/executionRequests/triggers';
import { StateChangeNotification } from 'models/state.models';
import { getTranslator } from 'state/i18n/selectors';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import Loader from 'views/common/waiting/Loader';
import { Alert } from '@material-ui/lab';
import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import { getAsyncEnviroments } from 'state/entities/environments/selectors';
import { triggerFetchEnvironments } from 'state/entities/environments/triggers';
import { IParameter } from 'models/state/iesiGeneric.models';
import OrderedList from 'views/common/list/OrderedList';
import isSet from '@snipsonian/core/es/is/isSet';

const useStyles = makeStyles(({ spacing, typography }) => ({
    formControl: {
        width: '100%',
        marginBottom: spacing(2),
        '& .SpinningDots': {
            fontSize: typography.pxToRem(4),
        },
    },
}));

interface IPublicProps {
    scriptName: string;
    open: boolean;
    onClose: () => void;
}

interface IFormValues {
    name: string;
    description: string;
    environment: string;
    parameters: IParameter[];
}

function ExecuteScriptDialog({
    onClose,
    scriptName,
    open,
    state,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const [formValues, setFormValues] = useState<IFormValues>({
        name: '',
        description: '',
        environment: '',
        parameters: [],
    });

    const [newParameter, setNewParameter] = useState<IParameter>({
        name: '',
        value: '',
    });

    const translator = getTranslator(state);
    const script = getScriptByName(state, scriptName);
    const createAsyncInfo = entitiesStateManager.getAsyncEntity({
        asyncEntityKey: ASYNC_ENTITY_KEYS.executionRequests,
    }).create;
    const environments = getAsyncEnviroments(state).data;
    const environmentsAsyncStatus = getAsyncEnviroments(state).fetch.status;

    // Trigger Fetch envs on open dialog
    useEffect(() => {
        if (open) {
            triggerFetchEnvironments();
        }
        return () => {};
    }, [open]);

    return (
        <ClosableDialog
            onClose={onClose}
            open={open}
            title={scriptName}
        >
            <Loader show={createAsyncInfo.status === AsyncStatus.Busy} />
            <Box marginBottom={2}>
                <Translate msg="scripts.overview.execute_script_dialog.text" />
            </Box>
            <Box textAlign="left" maxWidth={400} marginX="auto">
                <TextField
                    id="execute-script-name"
                    type="text"
                    value={formValues.name}
                    label={translator('scripts.overview.execute_script_dialog.form.name')}
                    className={classes.formControl}
                    autoFocus
                    required
                    onChange={(e) => {
                        setFormValues({
                            ...formValues,
                            name: e.target.value,
                        });
                    }}
                />
                <TextField
                    id="execute-script-description"
                    type="text"
                    value={formValues.description}
                    label={translator('scripts.overview.execute_script_dialog.form.description')}
                    className={classes.formControl}
                    required
                    onChange={(e) => {
                        setFormValues({
                            ...formValues,
                            description: e.target.value,
                        });
                    }}
                />
                <FormControl required className={classes.formControl}>
                    <Loader show={environmentsAsyncStatus === AsyncStatus.Busy} />
                    <InputLabel id="execute-script-environment-label">
                        <Translate msg="scripts.overview.execute_script_dialog.form.environment" />
                    </InputLabel>
                    <Select
                        labelId="execute-script-environment-label"
                        id="execute-script-environment"
                        value={formValues.environment}
                        onChange={(e) => {
                            setFormValues({
                                ...formValues,
                                environment: e.target.value as string,
                            });
                        }}
                    >
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
                <Box marginBottom={1}>
                    <InputLabel shrink>
                        <Translate msg="scripts.overview.execute_script_dialog.form.input_param.title" />
                    </InputLabel>
                    {formValues.parameters.length > 0 ? (
                        <OrderedList
                            items={formValues.parameters.map((param) => ({
                                content: `${param.name}: ${param.value}`,
                                onDelete: () => {
                                    setFormValues({
                                        ...formValues,
                                        parameters: formValues.parameters.filter((p) =>
                                            param.name !== p.name || param.value !== p.value),
                                    });
                                },
                            }))}
                        />
                    ) : (
                        <Typography variant="body2">
                            <Translate msg="scripts.overview.execute_script_dialog.form.input_param.empty" />
                        </Typography>
                    )}
                </Box>
                <Paper variant="outlined">
                    <Box padding={2}>
                        <InputLabel shrink>
                            <Translate msg="scripts.overview.execute_script_dialog.form.input_param.add.title" />
                        </InputLabel>
                        <Box display="flex" alignItems="center">
                            <Box flex="1 1 auto" paddingRight={0.5}>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="execute-script-input-param-name"
                                        type="text"
                                        // eslint-disable-next-line max-len
                                        label={translator('scripts.overview.execute_script_dialog.form.input_param.add.name')}
                                        value={newParameter.name}
                                        onChange={(e) => setNewParameter({
                                            ...newParameter,
                                            name: e.target.value,
                                        })}
                                    />
                                </FormControl>
                            </Box>
                            <Box flex="1 1 auto" paddingRight={0.5}>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="execute-script-input-param-value"
                                        type="text"
                                        // eslint-disable-next-line max-len
                                        label={translator('scripts.overview.execute_script_dialog.form.input_param.add.value')}
                                        value={newParameter.value}
                                        onChange={(e) => setNewParameter({
                                            ...newParameter,
                                            value: e.target.value,
                                        })}
                                    />
                                </FormControl>
                            </Box>
                            <Box flex="1 1 auto">
                                <Button
                                    id="add-input-param"
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    disabled={!newParameter.name.trim() || !newParameter.value.trim()}
                                    onClick={() => {
                                        setFormValues({
                                            ...formValues,
                                            parameters: [
                                                ...formValues.parameters,
                                                {
                                                    name: newParameter.name,
                                                    value: newParameter.value,
                                                },
                                            ],
                                        });
                                        setNewParameter({ name: '', value: '' });
                                    }}
                                >
                                    {/* eslint-disable-next-line max-len */}
                                    <Translate msg="scripts.overview.execute_script_dialog.form.input_param.add.button" />
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
                {createAsyncInfo.error && (
                    <Box marginTop={2}>
                        <Alert severity="error">
                            {isSet(createAsyncInfo.error.response.message) ? (
                                createAsyncInfo.error.response.message
                            ) : (
                                <Translate msg="scripts.overview.execute_script_dialog.error" />
                            )}
                        </Alert>
                    </Box>
                )}
                <Box marginTop={2} textAlign="right">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={createExecutionRequest}
                        disabled={
                            !formValues.name.trim() || !formValues.description.trim() || !formValues.environment.trim()
                        }
                    >
                        <Translate msg="scripts.overview.execute_script_dialog.confirm" />
                    </Button>
                </Box>
            </Box>
        </ClosableDialog>
    );

    function createExecutionRequest() {
        triggerCreateExecutionRequest({
            context: '', // May be ignored for now
            description: formValues.description.trim(),
            email: null, // May be ignored for now
            executionRequestLabels: [], // TODO
            executionRequestStatus: 'NEW',
            name: formValues.name.trim(),
            requestTimestamp: new Date(),
            scope: '', // May be ignored for now
            scriptExecutionRequests: [
                {
                    scriptName: script.name,
                    environment: formValues.environment,
                    exit: true, // TODO?
                    impersonations: [], // TODO
                    parameters: formValues.parameters,
                    scriptExecutionRequestStatus: 'NEW',
                    scriptVersion: script.version.number,
                },
            ],
        });
    }
}

export default observe<IPublicProps>([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.EXECUTION_REQUESTS_CREATE,
    StateChangeNotification.ENVIRONMENTS,
], ExecuteScriptDialog);
