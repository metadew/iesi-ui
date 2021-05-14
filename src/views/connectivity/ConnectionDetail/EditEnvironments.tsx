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
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
} from '@material-ui/core';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import { IObserveProps, observe } from 'views/observe';
import { IConnectionEnvironment } from 'models/state/connections.model';
import { getAsyncEnvironments } from 'state/entities/environments/selectors';
import Loader from 'views/common/waiting/Loader';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { triggerFetchEnvironments } from 'state/entities/environments/triggers';
import { StateChangeNotification } from 'models/state.models';
import { checkAuthorityGeneral, SECURITY_PRIVILEGES } from 'views/appShell/AppLogIn/components/AuthorithiesChecker';
import { Delete } from '@material-ui/icons';

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

interface IPublicProps {
    environments: IConnectionEnvironment[];
    isCreateConnectionRoute: boolean;
    onEnvironmentSelected: (index: number) => void;
    onSubmit: (environment: IConnectionEnvironment) => void;
    onDelete: (index: number) => void;
}

function EditEnvironmentsDialog({
    environments,
    isCreateConnectionRoute,
    state,
    onEnvironmentSelected,
    onSubmit,
    onDelete,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const [open, setOpen] = useState(false);
    const [environmentName, setEnvironmentName] = useState('');
    const environmentsAsync = getAsyncEnvironments(state);

    // Trigger Fetch envs on open dialog
    useEffect(() => {
        if (open) {
            triggerFetchEnvironments();
        } else {
            // Reset form & async status
        }
        return () => { };
    }, [open]);

    const handleSubmit = () => {
        onSubmit({ environment: environmentName, parameters: [] });
        setOpen(false);
    };

    return (
        <>
            {environments.length > 0
                ? (
                    <List>
                        {environments.map((environment, index) => (
                            <ListItem
                                key={environment.environment}
                                onClick={() => onEnvironmentSelected(index)}
                                button
                            >
                                <ListItemText primary={environment.environment} />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        size="small"
                                        onClick={() => {
                                            if (isCreateConnectionRoute
                                                || checkAuthorityGeneral(
                                                    SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE,
                                                )) {
                                                onDelete(index);
                                            }
                                        }}
                                    >
                                        <Delete />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2">
                        <Translate msg="scripts.detail.side.labels.empty" />
                    </Typography>
                )}
            <Button
                color="secondary"
                onClick={() => setOpen(true)}
            >
                Add environment
            </Button>
            <ClosableDialog
                onClose={() => setOpen(false)}
                open={open}
                title={translator('doc.dialog.edit.connection.title')}
                maxWidth="lg"
            >
                <Loader show={environmentsAsync.fetch.status === AsyncStatus.Busy} />
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
                                    defaultValue="Choose an environment"
                                    onBlur={(e) => setEnvironmentName(e.target.value)}
                                >
                                    <MenuItem value="Choose an environment" disabled>
                                        Choose an environment
                                    </MenuItem>
                                    {environmentsAsync.data && environmentsAsync.data.map((env) => (
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
                    </Box>
                </Box>
                <Box display="flex" width="100%" justifyContent="flex-end" className={classes.footer}>
                    <ButtonGroup size="small">
                        <Button
                            variant="outlined"
                            color="default"
                            size="small"
                            onClick={() => setOpen(false)}
                        >
                            <Translate
                                msg="doc.dialog.edit.connection.footer.cancel"
                            />
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={handleSubmit}
                        >
                            <Translate
                                msg="doc.dialog.edit.connection.footer.save"
                            />
                        </Button>
                    </ButtonGroup>
                </Box>
            </ClosableDialog>
        </>
    );
}

export default observe<IPublicProps>([
    StateChangeNotification.ENVIRONMENTS,
    StateChangeNotification.I18N_TRANSLATIONS,
], EditEnvironmentsDialog);
