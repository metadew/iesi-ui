import { Box, Button, Container, createStyles, Theme, Typography, WithStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withStyles } from '@material-ui/styles';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import React from 'react';
import { getStore } from 'state';
import TextInput from 'views/common/input/TextInput';
import { IObserveProps } from 'views/observe';

const styles = ({ palette, typography }: Theme) =>
    createStyles({
        header: {
            backgroundColor: palette.background.paper,
            borderBottom: '1px solid',
            borderBottomColor: palette.grey[200],
        },
        componentName: {
            fontWeight: typography.fontWeightBold,
            color: palette.primary.main,
        },
        componentType: {
            fontWeight: typography.fontWeightBold,
        },
        componentVersion: {
            fontWeight: typography.fontWeightBold,
        },
        componentDescription: {
            fontWeight: typography.fontWeightBold,
            fontSize: typography.pxToRem(12),
        },
    });

    type TProps = WithStyles<typeof styles>;

    interface IRedirectUri {
        pathname: string;
        search: string;
    }

    interface ILdapState {
        hasSubmitErrors: boolean;
        domain: string;
        base: string;
        user_dn:string
    }

    const LoginConfig = withStyles(styles)(
        class extends React.Component<TProps & IObserveProps, ILdapState> {
            public constructor(props: TProps & IObserveProps) {
                super(props);

            }

            public render() {
                const { hasSubmitErrors, domain, base, user_dn } = this.state;

                return (
                    <>
                    <Container component="main" maxWidth="xs">
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                            marginTop="85px"
                        >
                        </Box>
                        <TextInput
                            id="domain"
                            label="domain"
                            margin="normal"
                            required
                            error={hasSubmitErrors && domain === ''}
                            value={domain}
                            onChange={(e) => this.setState({ domain: e.target.value as string })}
                        />
                        <TextInput
                            id="base"
                            label="base"
                            required
                            error={hasSubmitErrors && base === ''}
                            value={base}
                            onChange={(e) => this.setState({ base: e.target.value as string })}
                        />
                        <TextInput
                            id="user_dn"
                            label="user_dn"
                            required
                            error={hasSubmitErrors && user_dn === ''}
                            value={user_dn}
                            onChange={(e) => this.setState({ user_dn: e.target.value as string })}
                        />
                        {this.renderAlert()}
                        <Box textAlign="left" marginTop={2}>
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                disableElevation
                                onClick={this.handleSubmit}
                            >
                                <Container component="main" maxWidth="xl">
                                    <Translate msg="login" />
                                </Container>
                            </Button>
                        </Box>
                    </Container>
                </>
                )
            }

            private setHasSubmitErrors(hasSubmitErrors: boolean) {
                this.setState({ hasSubmitErrors: hasSubmitErrors as boolean });
            }

            private handleSubmit = () => {
                const { domain, base, user_dn } = this.state;
                const { dispatch } = getStore();
                if (domain !== '' && base !== '' && user_dn !== '') {
                    this.setHasSubmitErrors(false);
                    //Todo login code
                } else {
                    this.setHasSubmitErrors(true);
                }
            };

            private renderAlert = () => {
                const { hasSubmitErrors } = this.state;
                if (!hasSubmitErrors) return null;
                return (
                    <Alert severity="error">
                        <Translate msg="Username and/or password is incorrect!" />
                    </Alert>
                );
            };
        }
    )