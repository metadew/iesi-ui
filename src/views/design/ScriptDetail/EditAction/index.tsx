import React from 'react';
import classnames from 'classnames';
import { THEME_COLORS } from 'config/themes/colors';
import {
    Box,
    makeStyles,
    IconButton,
    Typography,
    Checkbox,
    Paper,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { IScriptAction } from 'models/state/scripts.models';
import { formatNumberWithTwoDigits } from 'utils/number/format';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import TextInput from 'views/common/input/TextInput';
import { IObserveProps, observe } from 'views/observe';
import { getTranslator } from 'state/i18n/selectors';
import { StateChangeNotification } from 'models/state.models';
import ExpandableParameter from './ExpandableParameter';

interface IPublicProps {
    action: IScriptAction;
    onClose: () => void;
    onEdit: (action: IScriptAction) => void;
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
    },
    actionType: {
        color: palette.primary.main,
        fontWeight: typography.fontWeightBold,
    },
    descriptionTextField: {
        marginTop: 0,
        '& .MuiFilledInput-root': {
            background: palette.background.paper,
        },
    },
    footerAction: {
        fontSize: '.8rem',
        fontWeight: typography.fontWeightBold,
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
}));

function EditAction({ onClose, action, onEdit, state }: IPublicProps & IObserveProps) {
    const classes = useStyles();
    const translator = getTranslator(state);

    return (
        <Box className={classes.dialog}>
            <Box
                className={classes.header}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={1}
            >
                {/* eslint-disable-next-line max-len */}
                <Box paddingX={3} paddingY={1.1} boxSizing="content-box" width={50} className={classnames(classes.tableCell, classes.index)}>
                    {formatNumberWithTwoDigits(action.number)}
                </Box>
                {/* eslint-disable-next-line max-len */}
                <Box paddingX={3} paddingY={1.1} className={classnames(classes.tableCell, classes.actionType)} width="40%">
                    {action.type}
                </Box>
                {/* eslint-disable-next-line max-len */}
                <Box paddingX={3} paddingY={1.1} className={classnames(classes.actionName)} width="60%">
                    {action.name}
                </Box>
                <IconButton className={classes.headerAction} onClick={onClose}>
                    <Close />
                </IconButton>
            </Box>
            <Box padding={2}>
                <Box marginBottom={2}>
                    <Paper>
                        <TextInput
                            id="action-description"
                            label={translator('scripts.detail.edit_action.description')}
                            multiline
                            rows={3}
                            className={classes.descriptionTextField}
                            defaultValue={action.description}
                            onBlur={(e) => updateAction({ description: e.target.value })}
                        />
                    </Paper>
                </Box>
                {action.parameters.map((parameter, parameterIndex) => (
                    <ExpandableParameter
                        key={parameter.name}
                        onChange={(value) => {
                            const newParameters = action.parameters.map((item) => {
                                if (item.name === parameter.name) {
                                    return {
                                        ...item,
                                        value,
                                    };
                                }
                                return item;
                            });
                            updateAction({ parameters: newParameters });
                        }}
                        parameter={parameter}
                        number={parameterIndex + 1}
                    />
                ))}
                <Box display="flex" justifyContent="flex-end" marginTop={2}>
                    <Box display="flex" alignItems="center">
                        <Typography className={classes.footerAction}>
                            <Translate msg="scripts.detail.edit_action.footer.continue_on_fail" />
                        </Typography>
                        <Checkbox
                            edge="end"
                            checked={!action.errorStop}
                            onChange={() => updateAction({ errorStop: !action.errorStop })}
                        />
                    </Box>
                    <Box display="flex" alignItems="center" marginLeft={2}>
                        <Typography className={classes.footerAction}>
                            <Translate msg="scripts.detail.edit_action.footer.expected_to_fail" />
                        </Typography>
                        <Checkbox
                            edge="end"
                            checked={action.errorExpected}
                            onChange={() => updateAction({ errorExpected: !action.errorExpected })}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );

    function updateAction(fieldsToUpdate: Partial<IScriptAction>) {
        onEdit({
            ...action,
            ...fieldsToUpdate,
        });
    }
}

export default observe<IPublicProps>([StateChangeNotification.I18N_TRANSLATIONS], EditAction);
