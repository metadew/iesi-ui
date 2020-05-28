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
import { IDummyScriptActionParameter } from 'models/state/scripts.models';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

interface IPublicProps {
    onChange: (value: string) => void;
    parameter: IDummyScriptActionParameter;
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
    filledInput: {
        minWidth: '250px',
    },
}));

export default function ExpandableParameter({ parameter, onChange }: IPublicProps) {
    const classes = useStyles();

    return (
        <ExpansionPanel className={classes.expansionPanel}>
            <ExpansionPanelSummary
                expandIcon={<ExpandMore />}
                className={classes.expansionPanelSummary}
            >
                <Box>
                    <Typography className={classes.expansionPanelLabel}>
                        {parameter.name}
                    </Typography>
                    <Typography className={classes.expansionPanelTitle}>
                        {parameter.description}
                    </Typography>
                </Box>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionPanelDetail}>
                <FormControl
                    variant="filled"
                >
                    <InputLabel htmlFor="filled-adornment-password">
                        <Translate msg="scripts.detail.edit_action.parameter.value" />
                    </InputLabel>
                    <FilledInput
                        id="input"
                        type="text"
                        value={parameter.value}
                        onChange={(e) => onChange(e.target.value)}
                        className={classes.filledInput}
                    />
                </FormControl>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}
