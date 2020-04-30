import React from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { Box, makeStyles, Theme, Typography, Button } from '@material-ui/core';
import { AddRounded as AddIcon } from '@material-ui/icons';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

const useStyles = makeStyles(({ palette }: Theme) => ({
    aside: {
        width: '33%',
        maxWidth: '485px',
        background: palette.background.paper,
        flex: '1 1 auto',
    },
    content: {
        width: '66%',
        flex: '1 1 auto',
    },
    contentCenter: {
        justifyContent: 'center',
    },
}));

function ScriptDetail() {
    const { scriptId } = useParams();
    const classes = useStyles();

    return (
        <Box display="flex" flex="1 1 auto">
            <Box className={classes.aside}>
                <AppTemplateContainer>
                    <Typography variant="body1">{`Script detail: ${scriptId}`}</Typography>
                </AppTemplateContainer>
            </Box>
            <Box display="flex" flexDirection="column" className={classNames(classes.content, classes.contentCenter)}>
                <AppTemplateContainer>
                    <Box textAlign="center">
                        <Typography variant="h2" paragraph>
                            <Translate msg="scripts.detail.main.no_actions.title" />
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<AddIcon />}
                        >
                            <Translate msg="scripts.detail.main.no_actions.button" />
                        </Button>
                    </Box>
                </AppTemplateContainer>
            </Box>
        </Box>
    );
}

export default ScriptDetail;
