import React from 'react';
import {
    Box,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FilledInput,
    FormControl,
    InputLabel,
    makeStyles,
    Typography,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { IParameter } from 'models/state/iesiGeneric.models';
import { IConstantParameter } from 'models/state/constants.models';

interface IPublicProps {
    onChange: (value: string) => void;
    parameter: IParameter;
    constantParameter: IConstantParameter;
    readOnly: boolean;
}

const useStyles = makeStyles(({ palette, spacing }) => ({
    expansionPanel: {
        width: '100%',
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
    button: {
        marginLeft: 400,
    },
    paramValue: {
        whiteSpace: 'pre-wrap',
    },
}));

function ExpandableParameter({ parameter, onChange, constantParameter, readOnly = false }: IPublicProps) {
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
                <Box display="flex" flexDirection="column" alignItems="flex-start">
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
                        type="area"
                        value={parameter ? parameter.value : ''}
                        onChange={(e) => onChange(e.target.value)}
                        multiline
                        readOnly={readOnly}
                        className={classes.paramValue}
                    />
                </FormControl>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
}

export default ExpandableParameter;
