import React from 'react';
import {
    Box,
    Button,
    createStyles,
    Theme,
    Typography,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import { IObserveProps } from 'views/observe';
import AppTemplateContainer from 'views/appShell/AppTemplateContainer';
import Translate from '@snipsonian/react/es/components/i18n/Translate';

const styles = ({ palette, typography }: Theme) =>
    createStyles({
        header: {
            backgroundColor: palette.background.paper,
            borderBottom: '1px solid',
            borderBottomColor: palette.grey[200],
        },
        loadDocButton: {
            alignSelf: 'flex-end',
        },
        helperButton: {
            marginTop: 2,
            fontSize: typography.pxToRem(12),
            color: palette.grey[500],
        },
        listHeading: {
            fontWeight: 'bold',
        },
    });

interface IComponentState {
    openapiTitle: string;
    openapiVersion: string;
    connectionAmount: number;
    componentAmount: number;
}
type TProps = WithStyles<typeof styles>;

const OpenAPI = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps, IComponentState> {
        public constructor(props: TProps & IObserveProps) {
            super(props);

            this.state = {
                openapiTitle: '',
                openapiVersion: '',
                componentAmount: 0,
                connectionAmount: 0,
            };
        }

        public render() {
            const { classes } = this.props;
            const {
                openapiTitle,
                openapiVersion,
                componentAmount,
                connectionAmount,
            } = this.state;
            return (
                <Box height="100%" display="flex" flexDirection="column" flex="1 0 auto">
                    <Box
                        paddingTop={3}
                        paddingBottom={3}
                        className={classes.header}
                    >
                        <AppTemplateContainer>
                            <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="space-between"
                            >
                                <Typography variant="h6">
                                    <Translate
                                        msg="doc.overview.openapi_title"
                                        placeholders={{ title: openapiTitle }}
                                    />
                                </Typography>
                                <Typography variant="h6">
                                    <Translate
                                        msg="doc.overview.openapi_version"
                                        placeholders={{ title: openapiVersion }}
                                    />
                                </Typography>
                                <Box
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    className={classes.loadDocButton}
                                >
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"

                                    >
                                        <Translate msg="doc.overview.load_doc_button.title" />
                                    </Button>
                                    <Typography
                                        variant="subtitle1"
                                        className={classes.helperButton}
                                    >
                                        <Translate msg="doc.overview.load_doc_button.helper_text" />
                                    </Typography>
                                </Box>

                            </Box>
                        </AppTemplateContainer>
                    </Box>
                    <Box paddingBottom={5} margin={4}>
                        <Box
                            display="flex"
                            flexDirection="column"
                        >
                            <Box
                                display="flex"
                                flexDirection="column"
                                my={2}
                            >
                                <Typography
                                    variant="h5"
                                    className={classes.listHeading}
                                >
                                    <Translate
                                        msg="doc.overview.connection_header_amount"
                                        placeholders={{ amount: connectionAmount }}
                                    />
                                </Typography>
                            </Box>
                            <Box
                                display="flex"
                                flexDirection="column"
                                my={2}
                            >
                                <Typography
                                    variant="h5"
                                    className={classes.listHeading}
                                >
                                    <Translate
                                        msg="doc.overview.component_header_amount"
                                        placeholders={{ amount: componentAmount }}
                                    />
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            );
        }
    },
);

export default OpenAPI;
