import React, { useState } from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    FormControl,
    FormHelperText,
    InputLabel,
    makeStyles,
    MenuItem,
    Select,
    Theme,
    Typography,
} from '@material-ui/core';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import { IObserveProps, observe } from 'views/observe';
import { IConnectionEnvironment } from 'models/state/connections.model';
import { getAsyncEnvironments, getAsyncEnvironmentsEntity } from 'state/entities/environments/selectors';
import Loader from 'views/common/waiting/Loader';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { StateChangeNotification } from 'models/state.models';
import { TRequiredFieldsState } from 'models/form.models';
import requiredFieldsCheck from 'utils/form/requiredFieldsCheck';
import OrderedList from 'views/common/list/OrderedList';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';

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
    selectedIndex: number;
    isCreateConnectionRoute: boolean;
    onEnvironmentSelected: (index: number) => void;
    onSubmit: (environment: IConnectionEnvironment) => void;
    onDelete: (index: number) => void;
}

function EditEnvironmentsDialog({
    environments,
    selectedIndex,
    isCreateConnectionRoute,
    state,
    onEnvironmentSelected,
    onSubmit,
    onDelete,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);
    const [open, setOpen] = useState(false);
    const [environment, setEnvironment] = useState<IConnectionEnvironment>({ environment: '', parameters: [] });
    const [requiredFieldsState, setRequiredFieldsState] = useState<TRequiredFieldsState<IConnectionEnvironment>>({
        environment: {
            showError: false,
        },
    });
    const environmentsEntity = getAsyncEnvironmentsEntity(state);
    const environmentsAsync = getAsyncEnvironments(state);

    const handleSubmit = () => {
        const { passed: passedRequired, requiredFieldsState: requireFields } = requiredFieldsCheck({
            data: environment,
            requiredFields: ['environment'],
        });
        if (passedRequired) {
            onSubmit(environment);
            setOpen(false);
        } else {
            setRequiredFieldsState(requireFields);
        }
    };

    return (
        <>
            {environments.length > 0
                ? (
                    <OrderedList
                        items={environments.map((env, index) => ({
                            content: env.environment,
                            selected: selectedIndex === index,
                            button: true,
                            onSelect: () => onEnvironmentSelected(index),
                            onDelete: isCreateConnectionRoute
                            || checkAuthority(state, SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE)
                                ? () => onDelete(index) : null,
                        }))}
                    />
                ) : (
                    <Typography variant="body2">
                        <Translate msg="connections.detail.side.environments.empty" />
                    </Typography>
                )}
            { checkAuthority(state, SECURITY_PRIVILEGES.S_CONNECTIONS_WRITE)
                && (
                    <Button
                        variant="outlined"
                        color="default"
                        size="small"
                        disableElevation
                        onClick={() => setOpen(true)}
                    >
                        <Translate msg="connections.detail.side.environments.add_button" />
                    </Button>
                ) }
            <ClosableDialog
                onClose={() => setOpen(false)}
                open={open}
                title={translator('connections.detail.side.environments.add_dialog.title')}
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
                            <FormControl className={classes.select} error={requiredFieldsState.environment.showError}>
                                <InputLabel id="connection-environment-label">Environment</InputLabel>
                                <Select
                                    labelId="connection-environment-label"
                                    id="connection-environment"
                                    defaultValue="Choose an environment"
                                    // eslint-disable-next-line max-len
                                    onBlur={(e) => setEnvironment({ ...environment, environment: e.target.value })}
                                >
                                    <MenuItem value="Choose an environment" disabled>
                                        <Translate msg="connections.detail.side.environments.add_dialog.select_title" />
                                    </MenuItem>
                                    {
                                        environmentsEntity.map((env) => (
                                            <MenuItem
                                                key={JSON.stringify(env.name)}
                                                value={env.name}
                                            >
                                                {env.name}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                                {requiredFieldsState.environment.showError && (
                                    <FormHelperText>Environment name is required</FormHelperText>
                                )}
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
                                msg="connections.detail.side.environments.add_dialog.cancel"
                            />
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={handleSubmit}
                        >
                            <Translate
                                msg="connections.detail.side.environments.add_dialog.add"
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
