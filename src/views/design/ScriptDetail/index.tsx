import React from 'react';
import classNames from 'classnames';
import { useParams } from 'react-router-dom';
import { Box, makeStyles, Theme, Typography, Button } from '@material-ui/core';
import { AddRounded as AddIcon, Edit as EditIcon } from '@material-ui/icons';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import GoBack from 'views/common/navigation/GoBack';
import { ROUTE_KEYS } from 'views/routes';
import { ListColumns, IListItem } from 'models/list.models';
import GenericList from 'views/common/list/GenericList';

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
    actionName: {
        fontWeight: 700,
        color: palette.primary.main,
    },
    actionDescription: {
        fontWeight: 700,
    },
}));

interface IColumnNames {
    name: string;
    description: string;
}

const mockedListItems: IListItem<IColumnNames>[] = [{
    id: 1,
    columns: {
        name: 'Fetch',
        description: 'This action fetches the data',
    },
}, {
    id: 2,
    columns: {
        name: 'Sort',
        description: 'This action sorts the data',
    },
}, {
    id: 3,
    columns: {
        name: 'Filter',
        description: 'This action filters the data',
    },
}, {
    id: 4,
    columns: {
        name: 'Display',
        description: 'This action displays the data',
    },
}];

function ScriptDetail() {
    const { scriptId } = useParams();
    const classes = useStyles();

    const columns: ListColumns<IColumnNames> = {
        name: {
            fixedWidth: '30%',
            className: classes.actionName,
        },
        description: {
            fixedWidth: '70%',
            className: classes.actionDescription,
        },
    };

    return (
        <Box display="flex" flex="1 1 auto">
            <Box className={classes.aside} paddingTop={2}>
                <GoBack to={ROUTE_KEYS.R_SCRIPTS} />
                <AppTemplateContainer>
                    <Typography variant="body1">{`Script detail: ${scriptId}`}</Typography>
                </AppTemplateContainer>
            </Box>
            <Box display="flex" flexDirection="column" className={classNames(classes.content, classes.contentCenter)}>
                {mockedListItems.length === 0 ? (
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
                ) : (
                    <GenericList
                        listItems={mockedListItems}
                        columns={columns}
                        listActions={[
                            {
                                icon: <EditIcon />,
                                onClick: (id) => console.log(id),
                            },
                        ]}
                    />
                )}
            </Box>
        </Box>
    );
}

export default ScriptDetail;
