import React, { useEffect, useState } from 'react';
import { Box, Button, makeStyles, TextField } from '@material-ui/core';
import { IObserveProps, observe } from 'views/observe';
import { getTranslator } from 'state/i18n/selectors';
import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import { AsyncOperation, AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { triggerCreateConnectionDetail, triggerResetAsyncConnectionDetail } from 'state/entities/connections/triggers';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import { Alert } from '@material-ui/lab';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import Loader from 'views/common/waiting/Loader';
import { getConnectionByUniqueIFromDetailorList } from 'state/entities/connections/selectors';
import { StateChangeNotification } from 'models/state.models';
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
    connectionUniqueId: string;
    open: boolean;
    onClose: () => void;
}

function DuplicateConnectionDialog({
    onClose,
    connectionUniqueId,
    open,
    state,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const connection = getConnectionByUniqueIFromDetailorList(state, connectionUniqueId);
    const [connectionName, setConnectionName] = useState(connection?.name);
    const translator = getTranslator(state);
    const createAsyncInfo = entitiesStateManager.getAsyncEntity({
        asyncEntityKey: ASYNC_ENTITY_KEYS.connectionDetail,
    }).create;

    useEffect(() => {
        if (!open && createAsyncInfo.status === AsyncStatus.Success) {
            triggerResetAsyncConnectionDetail({
                resetDataOnTrigger: true,
                operation: AsyncOperation.create,
            });
        }
    }, [open, createAsyncInfo]);

    return (
        <ClosableDialog
            onClose={onClose}
            open={open}
            title={connection && `Duplicating ${connection.name}`}
        >
            <Box textAlign="left" maxWidth={400} marginX="auto">
                {createAsyncInfo.status === AsyncStatus.Success ? (
                    <>
                        <Alert severity="success">
                            <Translate msg="connections.overview.duplicate_connection_dialog.success.text" />
                        </Alert>
                        <Box marginTop={2} textAlign="center">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onClose}
                            >
                                <Translate
                                    msg="connections.overview.duplicate_connection_dialog.success.close_button"
                                />
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Loader show={createAsyncInfo.status === AsyncStatus.Busy} />
                        {!isSet(connection) && (
                            <Box marginBottom={2}>
                                <Alert severity="error">
                                    <Translate msg="connections.overview.duplicate_connection_dialog.init_error" />
                                </Alert>
                            </Box>
                        )}
                        <Box marginBottom={2}>
                            <Translate msg="connections.overview.duplicate_connection_dialog.text" />
                        </Box>
                        <TextField
                            id="duplicate-script-name"
                            type="text"
                            value={connectionName}
                            label={translator('connections.overview.duplicate_connection_dialog.form.name')}
                            className={classes.formControl}
                            autoFocus
                            required
                            onChange={(e) => setConnectionName(e.target.value)}
                        />
                        {createAsyncInfo.error && (
                            <Box marginTop={2}>
                                <Alert severity="error">
                                    {isSet(createAsyncInfo?.error?.response?.message) ? (
                                        createAsyncInfo.error.response.message
                                    ) : (
                                        <Translate msg="connections.overview.duplicate_connection_dialog.error" />
                                    )}
                                </Alert>
                            </Box>
                        )}
                        <Box marginTop={2} textAlign="right">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={createConnection}
                                disabled={
                                    !isSet(connection)
                                    || connection.name.trim() === connectionName.trim()
                                    || connectionName.trim().length <= 0
                                }
                            >
                                <Translate msg="scripts.overview.duplicate_script_dialog.confirm" />
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </ClosableDialog>
    );

    function createConnection() {
        triggerCreateConnectionDetail({
            ...connection,
            name: connectionName,
        });
    }
}

export default observe<IPublicProps>([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.CONNECTIVITY_CONNECTION_DETAIL,
], DuplicateConnectionDialog);
