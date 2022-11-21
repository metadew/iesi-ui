import React, { useState } from 'react';
import { Box, Button, ButtonGroup, darken, IconButton, InputAdornment, makeStyles } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IObserveProps, observe } from 'views/observe';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import TextInput from 'views/common/input/TextInput';
import { triggerUpdateUserDetailPassword } from 'state/entities/users/triggers';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { StateChangeNotification } from 'models/state.models';
import { getAsyncUserPasswordEntity } from 'state/entities/users/selectors';
import Loader from 'views/common/waiting/Loader';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';

const useStyles = makeStyles(({ palette }) => ({
    textField: {
        marginTop: 4,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
    },
    tableCell: {
        position: 'relative',
        '&:after': {
            content: '" "',
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '1px',
            backgroundColor: THEME_COLORS.GREY,
        },
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 8,
    },
    select: {
        alignSelf: 'flex-start',
        width: '100%',
        marginTop: 4,
        marginBottom: 4,
    },
    keyInput: {
        marginRight: 4,
    },
    valueInput: {
        marginLeft: 4,
    },
    addButton: {
        backgroundColor: palette.type === 'light'
            ? THEME_COLORS.GREY_LIGHT
            : darken(THEME_COLORS.GREY_DARK, 0.2),
    },
}));

interface IPublicProps {
    onClose: () => void;
    id: string;
}

function UpdatePasswordDialog({ onClose, id, state }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const { update } = getAsyncUserPasswordEntity(state);

    const handleSubmit = () => {
        triggerUpdateUserDetailPassword({
            id,
            password: {
                value: password,
                repeatedPassword,
            },
        });
        onClose();
    };

    return (
        <ClosableDialog
            onClose={onClose}
            title="Update password"
            open
        >
            <Loader show={update.status === AsyncStatus.Busy} />
            <Box>
                <Box padding={2}>
                    <Box className={classes.paper}>
                        <TextInput
                            id="update-password-field"
                            type={isShowPassword ? 'text' : 'password'}
                            placeholder="********"
                            label="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle repeated password visibility"
                                            onClick={() => {
                                                setIsShowPassword(!isShowPassword);
                                            }}
                                            onMouseDown={(e) => e.preventDefault}
                                        >
                                            {
                                                isShowPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )
                                            }
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextInput
                            id="update-repeatedPassword-field"
                            type={isShowPassword ? 'text' : 'password'}
                            placeholder="********"
                            label="Confirm the password"
                            value={repeatedPassword}
                            onChange={(e) => setRepeatedPassword(e.target.value)}
                            InputProps={{
                                disableUnderline: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle repeated password visibility"
                                            onClick={() => {
                                                setIsShowPassword(!isShowPassword);
                                            }}
                                            onMouseDown={(e) => e.preventDefault}
                                        >
                                            {
                                                isShowPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )
                                            }
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                </Box>
                <Box marginTop={3} textAlign="right">
                    <ButtonGroup size="small">
                        <Button
                            variant="outlined"
                            color="default"
                            onClick={() => onClose}
                            disableElevation
                        >
                            <Translate msg="users.detail.side.update_password.footer.cancel" />
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleSubmit}
                            disableElevation
                        >
                            <Translate msg="users.detail.side.update_password.footer.update" />
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </ClosableDialog>
    );
}

export default observe<IPublicProps>([
    StateChangeNotification.IAM_USER_DETAIL_PASSWORD,
], UpdatePasswordDialog);
