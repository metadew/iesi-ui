import React, { useState } from 'react';
import {
    Button,
    Box,
    makeStyles,
    FormControl,
    TextField,
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

const useStyles = makeStyles(({ spacing }) => ({
    formControl: {
        width: '100%',
        marginBottom: spacing(2),
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
    });

    const translator = getTranslator(state);
    const script = getScriptByName(state, scriptName);
    const createAsyncInfo = entitiesStateManager.getAsyncEntity({
        asyncEntityKey: ASYNC_ENTITY_KEYS.executionRequests,
    }).create;

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
            <FormControl className={classes.formControl}>
                <TextField
                    id="execute-script-name"
                    type="text"
                    value={formValues.name}
                    label={translator('scripts.overview.execute_script_dialog.form.name')}
                    onChange={(e) => {
                        setFormValues({
                            ...formValues,
                            name: e.target.value,
                        });
                    }}
                />
            </FormControl>
            <FormControl className={classes.formControl}>
                <TextField
                    id="execute-script-description"
                    type="text"
                    value={formValues.description}
                    label={translator('scripts.overview.execute_script_dialog.form.description')}
                    onChange={(e) => {
                        setFormValues({
                            ...formValues,
                            description: e.target.value,
                        });
                    }}
                />
            </FormControl>
            {createAsyncInfo.error && (
                <Box marginTop={2}>
                    <Alert severity="error">
                        <Translate msg="scripts.overview.execute_script_dialog.error" />
                    </Alert>
                </Box>
            )}

            <Box
                marginTop={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
            >
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={createExecutionRequest}
                    disabled={!formValues.name.trim() || !formValues.description.trim()}
                >
                    <Translate msg="scripts.overview.execute_script_dialog.confirm" />
                </Button>
            </Box>
        </ClosableDialog>
    );

    function createExecutionRequest() {
        triggerCreateExecutionRequest({
            context: null, // May be ignored for now
            description: formValues.description.trim(),
            email: null, // May be ignored for now
            executionRequestLabels: [], // TODO
            executionRequestStatus: 'NEW',
            name: formValues.name.trim(),
            requestTimestamp: new Date(),
            scope: null, // May be ignored for now
            scriptExecutionRequests: [
                {
                    scriptName: script.name,
                    environment: '', // TODO
                    exit: true, // TODO?
                    impersonations: [], // TODO
                    parameters: script.parameters,
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
], ExecuteScriptDialog);
