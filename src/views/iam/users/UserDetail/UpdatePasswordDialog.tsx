import React, { useState } from 'react';
import { Box, Button, ButtonGroup, darken, makeStyles } from '@material-ui/core';
import { THEME_COLORS } from 'config/themes/colors';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { observe } from 'views/observe';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import TextInput from 'views/common/input/TextInput';
import { triggerUpdateUserDetail } from 'state/entities/users/triggers';

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
    username: string;
}

function UpdatePasswordDialog({ onClose, id, username }: IPublicProps) {
    const classes = useStyles();
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');

    const handleSubmit = () => {
        triggerUpdateUserDetail({
            id,
            username,
            password,
            repeatedPassword,
        });
    };

    return (
        <ClosableDialog
            onClose={onClose}
            title="Update password"
            open
        >
            <Box>
                <Box padding={2}>
                    <Box className={classes.paper}>
                        <TextInput
                            id="update-password-field"
                            placeholder="********"
                            label="New password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextInput
                            id="update-repeatedPassword-field"
                            placeholder="********"
                            label="Confirm the password"
                            value={repeatedPassword}
                            onChange={(e) => setRepeatedPassword(e.target.value)}
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
                            color="default"
                            onClick={handleSubmit}
                            disableElevation
                        >
                            <Translate msg="users.detail.side.update_password.footer.save" />
                        </Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </ClosableDialog>
    );
}

export default observe<IPublicProps>([], UpdatePasswordDialog);
