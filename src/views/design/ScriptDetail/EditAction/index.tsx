import React, { useState } from 'react';
import {
    Box,
    makeStyles,
    IconButton,
    Typography,
    Checkbox,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { IDummyScriptAction } from 'models/state/scripts.models';
import { formatNumberWithTwoDigits } from 'utils/number/format';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import ExpandableParameter from './ExpandableParameter';

interface IPublicProps {
    index: number;
    action: IDummyScriptAction;
    onClose: () => void;
}

const useStyles = makeStyles(({ palette, spacing, typography }) => ({
    dialog: {
        background: palette.background.default,
    },
    header: {
        background: palette.background.paper,
    },
    headerAction: {
        margin: '2px 0',
    },
    column: {
        padding: `${spacing(1.1)}px ${spacing(3)}px`,
    },
    index: {
        fontWeight: typography.fontWeightBold,
        textAlign: 'center',
    },
    actionName: {
        fontWeight: typography.fontWeightBold,
        color: palette.primary.main,
    },
    actionDescription: {
        fontWeight: typography.fontWeightBold,
    },
    footerAction: {
        fontSize: '.8rem',
        fontWeight: typography.fontWeightBold,
    },
}));

function EditAction({ onClose, action, index }: IPublicProps) {
    const [parameters, setParameters] = useState([{
        id: 1,
        name: 'Parameter 1',
        description: 'Name of the parameter to set at runtime',
        value: '',
    }, {
        id: 2,
        name: 'Parameter 2',
        description: 'Amount of times this action should be repeated',
        value: '',
    }]);
    const classes = useStyles();

    return (
        <Box className={classes.dialog}>
            <Box
                className={classes.header}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={1}
            >
                <Box paddingX={3} paddingY={1.1} boxSizing="content-box" width={50} className={classes.index}>
                    {formatNumberWithTwoDigits(index)}
                </Box>
                <Box paddingX={3} paddingY={1.1} className={classes.actionName} width="30%">
                    {action.name}
                </Box>
                <Box paddingX={3} paddingY={1.1} className={classes.actionDescription} width="70%">
                    {action.description}
                </Box>
                <IconButton className={classes.headerAction} onClick={onClose}>
                    <Close />
                </IconButton>
            </Box>
            <Box padding={2}>
                {parameters.map((parameter) => (
                    <ExpandableParameter
                        onChange={(value) => {
                            const newParameters = parameters.map((item) => {
                                if (item.id === parameter.id) {
                                    return {
                                        ...item,
                                        value,
                                    };
                                }
                                return item;
                            });
                            setParameters(newParameters);
                        }}
                        parameter={parameter}
                    />
                ))}
                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                    <Box display="flex" alignItems="center">
                        <Typography className={classes.footerAction}>
                            <Translate msg="scripts.detail.edit_action.footer.continue_on_fail" />
                        </Typography>
                        <Checkbox
                            edge="end"
                        />
                    </Box>
                    <Box display="flex" alignItems="center" marginLeft={2}>
                        <Typography className={classes.footerAction}>
                            <Translate msg="scripts.detail.edit_action.footer.expected_to_fail" />
                        </Typography>
                        <Checkbox
                            edge="end"
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default EditAction;
