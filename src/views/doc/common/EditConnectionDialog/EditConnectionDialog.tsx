import React, { useEffect, useRef } from 'react';
import {
    Button,
    Box,
    TextField,
    makeStyles,
    Theme,
    Select,
    MenuItem,
} from '@material-ui/core';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import { IObserveProps, observe } from 'views/observe';
import { IConnectionEntity } from 'models/state/connections.model';
import { getAsyncEnvironments } from 'state/entities/environments/selectors';
import entitiesStateManager from 'state/entities/entitiesStateManager';
import { ASYNC_ENTITY_KEYS } from 'models/state/entities.models';
import Loader from 'views/common/waiting/Loader';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { triggerFetchEnvironments } from 'state/entities/environments/triggers';
import { editConnection } from 'state/ui/actions';
import { StateChangeNotification } from 'models/state.models';
import { connectionsEqual } from 'utils/connections/connectionUtils';

const useStyles = makeStyles(({ palette, typography }: Theme) => ({
    generateTooltip: {
        backgroundColor: palette.common.black,
        fontSize: typography.pxToRem(12),
        padding: 16,
    },
    generateTooltipArrow: {
        color: palette.common.black,
    },
    inputDivider: {
        marginTop: 4, marginBottom: 4,
    },
    fileHelper: {
        marginTop: 2,
        marginBottom: 2,
        fontSize: typography.pxToRem(12),
        color: palette.grey[500],
    },
    validateButton: {
        marginRight: 8,
    },
    input: {
        marginTop: 4,
        marginBottom: 4,
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
    connection: IConnectionEntity | undefined;
}

function EditConnectionDialog({ onClose, open, state, dispatch, connection }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const environments = getAsyncEnvironments(state).data;
    const environmentsAsyncInfo = entitiesStateManager.getAsyncEntity({
        asyncEntityKey: ASYNC_ENTITY_KEYS.environments,
    }).fetch;
    const nameInput = useRef<HTMLInputElement>();
    const descriptionInput = useRef<HTMLInputElement>();
    const hostInput = useRef<HTMLInputElement>();
    const baseUrlInput = useRef<HTMLInputElement>();
    const tlsInput = useRef<HTMLInputElement>();
    const envSelect = useRef<HTMLSelectElement>();

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
        const newConnection: IConnectionEntity = {
            name: nameInput.current.value,
            type: connection.type,
            description: descriptionInput.current.value,
            environment: envSelect.current.value,
            parameters: [{
                name: 'baseUrl',
                value: baseUrlInput.current.value,
            }, {
                name: 'host',
                value: hostInput.current.value,
            }, {
                name: 'tls',
                value: tlsInput.current.value,
            }],
            isHandled: true,
        };
        if (!connectionsEqual(connection, newConnection)) {
            dispatch(editConnection({
                currentConnection: connection,
                newConnection,
            }));
        }
        onClose();
    };

    return (
        <ClosableDialog
            onClose={onClose}
            open={open}
            title={translator('doc.dialog.edit.connection.title')}
        >
            <Loader show={environmentsAsyncInfo.status === AsyncStatus.Busy} />
            <Box marginX="auto" width="100%">
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="center"
                    width="100%"
                >
                    <TextField
                        variant="filled"
                        defaultValue={connection.name}
                        label={translator('doc.dialog.edit.connection.name')}
                        fullWidth
                        inputRef={nameInput}
                        className={classes.input}
                    />
                    <TextField
                        variant="filled"
                        defaultValue={connection.description}
                        label={translator('doc.dialog.edit.connection.description')}
                        fullWidth
                        inputRef={descriptionInput}
                        className={classes.input}
                        style={{ whiteSpace: 'pre-line' }}
                        rows={10}
                        multiline
                    />
                    <TextField
                        variant="filled"
                        defaultValue={connection.parameters[1].value}
                        label={translator('doc.dialog.edit.connection.host')}
                        fullWidth
                        inputRef={hostInput}
                        className={classes.input}
                    />
                    <TextField
                        variant="filled"
                        defaultValue={connection.parameters[0].value}
                        label={translator('doc.dialog.edit.connection.baseUrl')}
                        fullWidth
                        inputRef={baseUrlInput}
                        className={classes.input}
                    />
                    <TextField
                        variant="filled"
                        defaultValue={connection.parameters[2].value}
                        label={translator('doc.dialog.edit.connection.tls')}
                        fullWidth
                        inputRef={tlsInput}
                        className={classes.input}
                    />
                    <Select
                        labelId="connection-environment-label"
                        id="connection-environment"
                        defaultValue={connection.environment}
                        inputRef={envSelect}
                        className={`${classes.select} ${classes.input}`}
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
                </Box>
            </Box>
            <Box display="flex" width="100%" justifyContent="flex-end" className={classes.footer}>
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    className={classes.validateButton}
                    onClick={onValidateClick}
                >
                    <Translate
                        msg="doc.dialog.transform.validate"
                    />
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={onClose}
                >
                    <Translate
                        msg="common.action.cancel"
                    />
                </Button>
            </Box>
        </ClosableDialog>

    );
}

export default observe<IPublicProps>([StateChangeNotification.ENVIRONMENTS], EditConnectionDialog);
