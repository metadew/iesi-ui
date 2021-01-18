import React from 'react';
import {
    Box,
    makeStyles,
    ExpansionPanel,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelDetails,
    FormControl,
    InputLabel,
    FilledInput,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IParameter } from 'models/state/iesiGeneric.models';
import { IConstantParameter } from 'models/state/constants.models';
import { checkAuthority, SECURITY_PRIVILEGES } from 'views/appShell/AppLogIn/components/AuthorithiesChecker';

interface IPublicProps {
    onChange: (value: string) => void;
    parameter: IParameter;
    constantParameter: IConstantParameter;
}

const useStyles = makeStyles(({ palette, spacing }) => ({
    expansionPanel: {
        margin: '0 !important',
        background: palette.background.paper,
        boxShadow: 'none',
        borderLeft: `1px solid ${palette.grey[300]}`,
        borderRight: `1px solid ${palette.grey[300]}`,
        borderBottom: `1px solid ${palette.grey[300]}`,
        borderLeftColor: palette.grey[300],
        padding: `${spacing(1)}px ${spacing(2)}px`,
        '&:first-child': {
            borderTop: `1px solid ${palette.grey[300]}`,
        },
    },
    expansionPanelTitle: {
        fontSize: '1.25em',
    },
    expansionPanelLabel: {
        fontSize: '.8rem',
        color: palette.grey[500],
    },
    expansionPanelSummary: {
        margin: 0,
        paddingLeft: 0,
        paddingRight: 0,
    },
    expansionPanelDetail: {
        paddingLeft: 0,
        paddingRight: 0,
    },
}));

export default function ExpandableParameter({ parameter, onChange, constantParameter }: IPublicProps) {
    const classes = useStyles();

    if (!constantParameter) {
        return null;
    }

    return (
        <ExpansionPanel className={classes.expansionPanel}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMore />}
                className={classes.expansionPanelSummary}
            >
                <Box>
                    <Typography className={classes.expansionPanelLabel}>
                        {constantParameter.name}
                        {constantParameter.mandatory && <span>&nbsp;*</span>}
                    </Typography>
                    <Typography className={classes.expansionPanelTitle}>
                        {constantParameter.description}
                    </Typography>
                </Box>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionPanelDetail}>
                <FormControl
                    variant="filled"
                    fullWidth
                >
                    <InputLabel htmlFor="filled-adornment-password">
                        <Translate msg="scripts.detail.edit_action.parameter.value" />
                    </InputLabel>
                    <FilledInput
                        id={`${constantParameter.name}-input`}
                        type="text"
                        value={parameter ? parameter.value : ''}
                        onChange={(e) => onChange(e.target.value)}
                        multiline
                        readOnly={!checkAuthority(SECURITY_PRIVILEGES.S_SCRIPTS_WRITE, 'PUBLIC')}
                    />
                </FormControl>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}
