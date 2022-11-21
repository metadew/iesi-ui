import React, { useEffect, useRef, useState } from 'react';
import { IObserveProps, observe } from 'views/observe';
import { Box, Button, ButtonGroup, FormControl, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import { StateChangeNotification } from 'models/state.models';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import { getTranslator } from 'state/i18n/selectors';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getAsyncSecurityGroups, getAsyncSecurityGroupsEntity } from 'state/entities/securityGroups/selectors';
import { triggerFetchSecurityGroups } from 'state/entities/securityGroups/triggers';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import { Autocomplete } from '@material-ui/lab';
import OrderedList from 'views/common/list/OrderedList';
import { ITeamSecurityGroup } from 'models/state/team.model';
import { ISecurityGroup } from 'models/state/securityGroups.model';
import { redirectTo, ROUTE_KEYS } from 'views/routes';

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
    teamSecurityGroups: ITeamSecurityGroup[];
    selectedIndex: number;
    isCreateTeamRoute: boolean;
    onSecurityGroupSelected: (index: number) => void;
    onSubmit: (securityGroup: ISecurityGroup) => void;
    onDelete: (id: string) => void;
}

function EditSecurityGroupDialog({
    state,
    onSubmit,
    onDelete,
    teamSecurityGroups,
    selectedIndex,
}: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');
    const [securityGroup, setSecurityGroup] = useState<ISecurityGroup>(undefined);
    const translator = getTranslator(state);
    const loading = getAsyncSecurityGroupsEntity(state).fetch.status === AsyncStatus.Busy;
    const securityGroups = getAsyncSecurityGroups(state);
    const ref = useRef(null);

    useEffect(() => {
        if (open) {
            triggerFetchSecurityGroups({
                pagination: {
                    page: 1,
                    size: 10,
                },
                filter: {
                    name: input.length > 0 && input,
                },
                sort: 'name,asc',
            });
        }
    }, [open, input]);

    const handleChange = (_: React.ChangeEvent<{}>, value: ISecurityGroup) => {
        setSecurityGroup(value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        if (securityGroup) {
            onSubmit(securityGroup);
        }
        setOpen(false);
    };

    return (
        <>
            {
                teamSecurityGroups.length > 0
                    ? (
                        <OrderedList
                            items={teamSecurityGroups.map((securityGroupItem, index) => ({
                                content: securityGroupItem.name,
                                selected: selectedIndex === index,
                                button: false,
                                onDelete: checkAuthority(state, SECURITY_PRIVILEGES.S_TEAMS_WRITE)
                                    ? () => onDelete(securityGroupItem.id) : null,
                                onView: () => {
                                    redirectTo({
                                        routeKey: ROUTE_KEYS.R_SECURITY_GROUP_DETAIL,
                                        params: {
                                            name: securityGroupItem.name,
                                        },
                                    });
                                },
                            }))}
                        />
                    ) : (
                        <Typography variant="body2">
                            <Translate msg="teams.detail.side.security_groups.empty" />
                        </Typography>
                    )
            }
            {checkAuthority(state, SECURITY_PRIVILEGES.S_TEAMS_WRITE)
                && (
                    <Button
                        variant="outlined"
                        color="default"
                        size="small"
                        disableElevation
                        onClick={() => setOpen(true)}
                    >
                        <Translate msg="teams.detail.side.security_groups.add_button" />
                    </Button>
                )}
            <ClosableDialog
                onClose={() => setOpen(false)}
                open={open}
                title={translator('teams.detail.side.security_groups.add_dialog.select_title')}
                maxWidth="lg"
            >
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
                                <Autocomplete
                                    ref={ref}
                                    id="teams-security_groups"
                                    getOptionLabel={(option: ISecurityGroup) => option.name}
                                    onInputChange={(_, newValue) => setInput(newValue)}
                                    onChange={handleChange}
                                    options={filterExistingSecurityGroups(securityGroups, teamSecurityGroups)}
                                    loading={loading}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Security groups"
                                            variant="outlined"
                                        />
                                    )}
                                    freeSolo
                                />
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
                            onClick={handleClose}
                        >
                            <Translate
                                msg="teams.detail.side.security_groups.add_dialog.cancel"
                            />
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={handleSubmit}
                        >
                            <Translate
                                msg="teams.detail.side.security_groups.add_dialog.add"
                            />
                        </Button>
                    </ButtonGroup>
                </Box>
            </ClosableDialog>
        </>
    );
}

function filterExistingSecurityGroups(securityGroups: ISecurityGroup[], teamSecurityGroups: ITeamSecurityGroup[]) {
    return securityGroups
        .filter((securityGroup) =>
            !teamSecurityGroups.find((teamSecurityGroup) =>
                securityGroup.id === teamSecurityGroup.id));
}

export default observe<IPublicProps>([
    StateChangeNotification.IAM_SECURITY_GROUPS_LIST,
    StateChangeNotification.I18N_TRANSLATIONS,
], EditSecurityGroupDialog);
