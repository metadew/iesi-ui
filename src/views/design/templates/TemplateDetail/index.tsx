import React from 'react';
import { Box, Button, Collapse, createStyles, Typography, WithStyles, withStyles } from '@material-ui/core';
import {
    ITemplateAnyMatcherColumnNames,
    ITemplateBase,
    ITemplateFixedMatcherColumnNames,
    ITemplateTemplateMatcherColumnNames,
} from 'models/state/templates.model';
import { TRequiredFieldsState } from 'models/form.models';
import { IObserveProps, observe } from 'views/observe';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StateChangeNotification } from 'models/state.models';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { getTranslator } from 'state/i18n/selectors';
import TextInput from 'views/common/input/TextInput';
import { getRouteKeyByPath, ROUTE_KEYS } from 'views/routes';
import { checkAuthority } from 'state/auth/selectors';
import { SECURITY_PRIVILEGES } from 'models/state/auth.models';
import DescriptionList from 'views/common/list/DescriptionList';
import { Add, Edit } from '@material-ui/icons';
import { IListItem, ListColumns } from 'models/list.models';
import { Alert } from '@material-ui/lab';
import GenericList from 'views/common/list/GenericList';
import EditMatcher from 'views/design/templates/TemplateDetail/EditMatcher';
import DetailActions from 'views/design/templates/TemplateDetail/DetailActions';
import ClosableDialog from 'views/common/layout/ClosableDialog';
import {
    triggerCreateTemplateDetail,
    triggerDeleteTemplateDetail,
    triggerUpdateTemplateDetail,
} from 'state/entities/templates/triggers';
import { getAsyncTemplateDetail } from 'state/entities/templates/selectors';
import { getUniqueIdFromTemplate } from 'utils/templates/templateUtils';
import { AsyncStatus } from 'snipsonian/observable-state/src/actionableStore/entities/types';
import Loader from 'views/common/waiting/Loader';
import { clone } from 'lodash';
import DeleteIcon from '@material-ui/icons/Delete';
import ConfirmationDialog from 'views/common/layout/ConfirmationDialog';

const styles = () => createStyles({});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newTemplateDetail: ITemplateBase;
    matcherIndexToEdit: number;
    matcherIndexToDelete: number;
    hasChangeToCheck: boolean;
    isAddOpen: boolean;
    isSaveDialogOpen: boolean;
    isConfirmDeleteOpen: boolean;
    requiredFieldsState: TRequiredFieldsState<ITemplateBase>;
}

const initialTemplateDetail: ITemplateBase = {
    name: '',
    description: '',
    version: 0,
    matchers: [],
};

const TemplateDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);
            this.state = {
                newTemplateDetail: initialTemplateDetail,
                matcherIndexToEdit: null,
                matcherIndexToDelete: null,
                hasChangeToCheck: false,
                isAddOpen: false,
                isSaveDialogOpen: false,
                isConfirmDeleteOpen: false,
                requiredFieldsState: {
                    name: {
                        showError: false,
                    },
                    version: {
                        showError: false,
                    },
                },
            };

            this.renderTemplateDetailPanel = this.renderTemplateDetailPanel.bind(this);
            this.renderTemplateDetailContent = this.renderTemplateDetailContent.bind(this);
            this.renderEditMatcher = this.renderEditMatcher.bind(this);
            this.isCreateTemplateRoute = this.isCreateTemplateRoute.bind(this);
            this.updateTemplate = this.updateTemplate.bind(this);
            this.onDeleteMatcher = this.onDeleteMatcher.bind(this);
            this.onDeleteTemplate = this.onDeleteTemplate.bind(this);

            // eslint-disable-next-line max-len
            this.updateTemplateInStateifNewTemplateWasLoaded = this.updateTemplateInStateifNewTemplateWasLoaded.bind(this);
        }

        public componentDidUpdate(prevProps: TProps & IObserveProps) {
            this.updateTemplateInStateifNewTemplateWasLoaded(prevProps);
        }

        render() {
            const { state } = this.props;
            const {
                isAddOpen,
                matcherIndexToEdit,
                isSaveDialogOpen,
                newTemplateDetail,
                matcherIndexToDelete,
                isConfirmDeleteOpen,
            } = this.state;
            const translator = getTranslator(state);
            const templateDetailAsyncFetchInfo = getAsyncTemplateDetail(state).fetch.status;
            const templateDetailAsyncDeleteInfo = getAsyncTemplateDetail(state).remove.status;

            if (!newTemplateDetail && templateDetailAsyncFetchInfo === AsyncStatus.Busy) {
                return <Loader show />;
            }

            return (
                <>
                    <ContentWithSidePanel
                        panel={this.renderTemplateDetailPanel()}
                        content={this.renderTemplateDetailContent()}
                        toggleLabel={<Translate msg="templates.detail.side.toggle_button" />}
                        contentOverlay={this.renderEditMatcher()}
                        contentOverlayOpen={isAddOpen || matcherIndexToEdit !== null}
                        goBackTo={ROUTE_KEYS.R_TEMPLATES}
                    />
                    <ConfirmationDialog
                        title={translator('templates.detail.delete_matcher_dialog.title')}
                        text={translator('templates.detail.delete_matcher_dialog.text')}
                        open={matcherIndexToDelete !== null}
                        onClose={() => this.setState({ matcherIndexToDelete: null })}
                        onConfirm={this.onDeleteMatcher}
                    />
                    <ConfirmationDialog
                        title={translator('templates.detail.delete_template_dialog.title')}
                        text={translator({
                            msg: 'templates.detail.delete_template_dialog.text',
                            placeholders: {
                                templateName: newTemplateDetail.name,
                            },
                        })}
                        open={isConfirmDeleteOpen}
                        onClose={() => this.setState({ isConfirmDeleteOpen: false })}
                        onConfirm={this.onDeleteTemplate}
                        showLoader={templateDetailAsyncDeleteInfo === AsyncStatus.Busy}
                    />
                    <ClosableDialog
                        title={this.isCreateTemplateRoute() ? (
                            translator('templates.detail.save_template_dialog.title_create')
                        ) : translator('templates.detail.save_template_dialog.title_update')}
                        open={isSaveDialogOpen}
                        onClose={() => this.setState({ isSaveDialogOpen: false })}
                    >
                        <Typography>
                            <Translate
                                msg={this.isCreateTemplateRoute() ? (
                                    'templates.detail.save_template_dialog.text_create'
                                ) : 'templates.detail.save_template_dialog.text_update'}
                                placeholders={{
                                    templateName: newTemplateDetail.name,
                                }}
                            />
                        </Typography>
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            marginTop={2}
                        >
                            <Box paddingLeft={1}>
                                <Button
                                    id="save-update-current-version"
                                    onClick={() => {
                                        triggerUpdateTemplateDetail(newTemplateDetail);
                                        this.setState({ isSaveDialogOpen: false });
                                    }}
                                    color="secondary"
                                    variant="contained"
                                    disabled={this.isCreateTemplateRoute() || (newTemplateDetail && !checkAuthority(
                                        state,
                                        SECURITY_PRIVILEGES.S_TEMPLATES_WRITE,
                                    ))}
                                >
                                    <Translate
                                        msg="templates.detail.save_template_dialog.update_current_version"
                                    />
                                </Button>
                            </Box>
                            <Box paddingLeft={1}>
                                <Button
                                    id="save-save-as-new-version"
                                    onClick={() => {
                                        triggerCreateTemplateDetail({
                                            ...newTemplateDetail,
                                            version: this.isCreateTemplateRoute() ? (
                                                newTemplateDetail.version
                                            ) : (
                                                newTemplateDetail.version + 1
                                            ),
                                        });
                                        this.setState({ isSaveDialogOpen: false });
                                    }}
                                    color="secondary"
                                    variant="outlined"
                                    disabled={newTemplateDetail && !checkAuthority(
                                        state,
                                        SECURITY_PRIVILEGES.S_TEMPLATES_WRITE,
                                    )}
                                >
                                    <Translate
                                        msg="templates.detail.save_template_dialog.save_as_new_version"
                                    />
                                </Button>
                            </Box>
                        </Box>
                    </ClosableDialog>
                </>
            );
        }

        private renderTemplateDetailPanel() {
            const { state } = this.props;
            const { newTemplateDetail, requiredFieldsState } = this.state;
            const translator = getTranslator(state);

            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <TextInput
                                id="template-name"
                                label={translator('templates.detail.side.template_name')}
                                InputProps={{
                                    readOnly: !this.isCreateTemplateRoute() && newTemplateDetail !== undefined,
                                    disableUnderline: true,
                                }}
                                value={newTemplateDetail.name}
                                onChange={(e) => this.updateTemplate({ name: e.target.value })}
                                required={this.isCreateTemplateRoute()}
                                error={requiredFieldsState.name.showError}
                                helperText={requiredFieldsState.name.showError && 'Template name is a required field'}
                            />
                            <TextInput
                                id="template-description"
                                label={translator('templates.detail.side.template_description')}
                                InputProps={{
                                    readOnly: !this.isCreateTemplateRoute() && newTemplateDetail && !checkAuthority(
                                        state,
                                        SECURITY_PRIVILEGES.S_TEMPLATES_WRITE,
                                    ),
                                    disableUnderline: true,
                                }}
                                value={newTemplateDetail.description}
                                onChange={(e) => this.updateTemplate({ description: e.target.value })}
                                required={this.isCreateTemplateRoute()}
                                rows={8}
                                multiline
                            />
                            {
                                this.isCreateTemplateRoute() ? (
                                    <>
                                        <TextInput
                                            id="template-version"
                                            label={translator('templates.detail.side.template_version')}
                                            type="number"
                                            InputProps={{
                                                readOnly: !this.isCreateTemplateRoute() && !checkAuthority(
                                                    state,
                                                    SECURITY_PRIVILEGES.S_TEMPLATES_WRITE,
                                                ),
                                                disableUnderline: true,
                                            }}
                                            value={newTemplateDetail.version}
                                            onChange={(e) => {
                                                this.updateTemplate({ version: parseInt(e.target.value, 10) });
                                            }}
                                            required={this.isCreateTemplateRoute()}
                                            error={requiredFieldsState.version.showError}
                                            helperText={requiredFieldsState.version.showError
                                                && 'Template version is a required field'}
                                        />
                                    </>
                                ) : (
                                    <DescriptionList
                                        noLineAfterListItem
                                        items={[{
                                            label: translator('templates.detail.side.template_version'),
                                            value: (newTemplateDetail && newTemplateDetail.version) || '',
                                        }]}
                                    />
                                )
                            }
                        </form>
                    </Box>
                </Box>
            );
        }

        private renderTemplateDetailContent() {
            const { newTemplateDetail, hasChangeToCheck } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            const [anyMatchers, fixedMatchers, templateMatchers] = getMatchersFromTemplateDetail(newTemplateDetail);
            const hasMatchers = newTemplateDetail.matchers.length;

            /*
            const handleSaveAction = () => {
                const { passed: passedRequired, requiredFieldsState } = requiredFieldsCheck({
                    data: newTemplateDetail,
                    requiredFields: ['name', 'version'],
                });

                this.setState({ requiredFieldsState });

                if (passedRequired) {
                    this.setState({ hasChangeToCheck: false, isSaveDialogOpen: true });
                }
            };
             */

            if (!hasMatchers) {
                return (
                    <Box
                        display="flex"
                        flexDirection="column"
                        flex="1 1 auto"
                        justifyContent="center"
                        paddingBottom={5}
                    >
                        <Box textAlign="center">
                            <Typography variant="h2" paragraph>
                                <Translate msg="templates.detail.main.no_matchers.title" />
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<Add />}
                                onClick={() => this.setState({ isAddOpen: true })}
                            >
                                <Translate msg="templates.detail.main.no_matchers.button" />
                            </Button>
                        </Box>
                    </Box>
                );
            }

            const anyColumns: ListColumns<ITemplateAnyMatcherColumnNames> = {
                type: {
                    label: <Translate msg="templates.detail.main.list.labels.type" />,
                    fixedWidth: '14%',
                },
                key: {
                    label: <Translate msg="templates.detail.main.list.labels.key" />,
                    fixedWidth: '86%',
                },
            };

            const fixedColumns: ListColumns<ITemplateFixedMatcherColumnNames> = {
                type: {
                    label: <Translate msg="templates.detail.main.list.labels.type" />,
                    fixedWidth: '14%',
                },
                key: {
                    label: <Translate msg="templates.detail.main.list.labels.key" />,
                    fixedWidth: '36%',
                },
                value: {
                    label: <Translate msg="templates.detail.main.list.labels.value" />,
                    fixedWidth: '50%',
                },
            };

            const templateColumns: ListColumns<ITemplateTemplateMatcherColumnNames> = {
                type: {
                    label: <Translate msg="templates.detail.main.list.labels.type" />,
                    fixedWidth: '14%',
                },
                key: {
                    label: <Translate msg="templates.detail.main.list.labels.key" />,
                    fixedWidth: '36%',
                },
                templateName: {
                    label: <Translate msg="templates.detail.main.list.labels.template_name" />,
                    fixedWidth: '36%',
                },
                templateVersion: {
                    label: <Translate msg="templates.detail.main.list.labels.template_version" />,
                    fixedWidth: '14%',
                },
            };

            return (
                <>
                    <Box>
                        <Collapse in={hasChangeToCheck}>
                            <Box marginX={2} marginBottom={2}>
                                <Alert severity="warning">
                                    <Translate msg="templates.detail.main.alert.save_changes" />
                                </Alert>
                            </Box>
                        </Collapse>
                        <DetailActions
                            onSave={() => { this.setState({ isSaveDialogOpen: true }); }}
                            onDelete={() => this.setState({ isConfirmDeleteOpen: true })}
                            onAdd={() => this.setState({ isAddOpen: true })}
                            isCreateRoute={this.isCreateTemplateRoute()}
                        />
                    </Box>
                    <Box marginY={1}>
                        <GenericList
                            listItems={anyMatchers}
                            columns={anyColumns}
                            listActions={[{
                                icon: <Edit />,
                                label: translator('templates.detail.main.list.actions.edit'),
                                onClick: (id) => this.setState({ matcherIndexToEdit: id as number }),
                                hideAction: () => !checkAuthority(state, SECURITY_PRIVILEGES.S_TEMPLATES_WRITE),
                            }, {
                                icon: <DeleteIcon />,
                                label: translator('templates.detail.main.list.actions.delete'),
                                onClick: (id) => this.setState({ matcherIndexToDelete: id as number }),
                                hideAction: () => !checkAuthority(state, SECURITY_PRIVILEGES.S_TEMPLATES_WRITE),
                            }]}
                            hideNoResultHelper
                        />
                        <GenericList
                            listItems={fixedMatchers}
                            columns={fixedColumns}
                            listActions={[{
                                icon: <Edit />,
                                label: translator('templates.detail.main.list.actions.edit'),
                                onClick: (id) => this.setState({ matcherIndexToEdit: id as number }),
                                hideAction: () => !checkAuthority(state, SECURITY_PRIVILEGES.S_TEMPLATES_WRITE),
                            }, {
                                icon: <DeleteIcon />,
                                label: translator('templates.detail.main.list.actions.delete'),
                                onClick: (id) => this.setState({ matcherIndexToDelete: id as number }),
                                hideAction: () => !checkAuthority(state, SECURITY_PRIVILEGES.S_TEMPLATES_WRITE),
                            }]}
                            hideNoResultHelper
                        />
                        <GenericList
                            listItems={templateMatchers}
                            columns={templateColumns}
                            listActions={[{
                                icon: <Edit />,
                                label: translator('templates.detail.main.list.actions.edit'),
                                onClick: (id) => this.setState({ matcherIndexToEdit: id as number }),
                                hideAction: () => !checkAuthority(state, SECURITY_PRIVILEGES.S_TEMPLATES_WRITE),
                            }, {
                                icon: <DeleteIcon />,
                                label: translator('templates.detail.main.list.actions.delete'),
                                onClick: (id) => this.setState({ matcherIndexToDelete: id as number }),
                                hideAction: () => !checkAuthority(state, SECURITY_PRIVILEGES.S_TEMPLATES_WRITE),
                            }]}
                            hideNoResultHelper
                        />
                    </Box>
                </>
            );
        }

        private onDeleteTemplate() {
            const { state } = this.props;
            const detail = getAsyncTemplateDetail(state).data;

            if (detail) {
                triggerDeleteTemplateDetail(detail);
            }
        }

        private onDeleteMatcher() {
            const { newTemplateDetail, matcherIndexToDelete } = this.state;
            const newMatchers = [...newTemplateDetail.matchers];

            if (matcherIndexToDelete !== null) {
                newMatchers.splice(matcherIndexToDelete, 1);
                this.updateTemplate({ matchers: newMatchers });
                this.setState({ matcherIndexToDelete: null });
            }
        }

        private renderEditMatcher() {
            const { newTemplateDetail, matcherIndexToEdit } = this.state;
            return (
                <EditMatcher
                    onClose={() => this.setState({ isAddOpen: false, matcherIndexToEdit: null })}
                    onEdit={(matcher) => {
                        const matchers = matcherIndexToEdit !== null ? (
                            newTemplateDetail.matchers.map((matcherState, index) => {
                                if (index !== matcherIndexToEdit) {
                                    return matcherState;
                                }
                                return matcher;
                            })
                        ) : [...newTemplateDetail.matchers, matcher];
                        this.updateTemplate({
                            matchers,
                        });
                        this.setState({ isAddOpen: false, matcherIndexToEdit: null });
                    }}
                    matcher={newTemplateDetail.matchers[matcherIndexToEdit]}
                />
            );
        }

        private updateTemplateInStateifNewTemplateWasLoaded(prevProps: TProps & IObserveProps) {
            const templateDetail = getAsyncTemplateDetail(this.props.state).data;
            const prevTemplateDetail = getAsyncTemplateDetail(prevProps.state).data;

            if (getUniqueIdFromTemplate(templateDetail) !== getUniqueIdFromTemplate(prevTemplateDetail)) {
                if (templateDetail) {
                    const templateDetailDeepClone = clone(templateDetail);
                    this.setState({
                        newTemplateDetail: templateDetailDeepClone,
                    });
                }
            }
        }

        private updateTemplate(fieldsToUpdate: Partial<ITemplateBase>) {
            this.setState((prevState) => ({
                newTemplateDetail: {
                    ...prevState.newTemplateDetail,
                    ...fieldsToUpdate,
                },
                hasChangeToCheck: true,
            }));
        }

        private isCreateTemplateRoute() {
            const currentRouteKey = getRouteKeyByPath({ path: this.props.match.path });
            return currentRouteKey === ROUTE_KEYS.R_TEMPLATE_NEW;
        }
    },
);

function getMatchersFromTemplateDetail(template: ITemplateBase) {
    const anyMatchers: IListItem<ITemplateAnyMatcherColumnNames>[] = [];
    const fixedMatchers: IListItem<ITemplateFixedMatcherColumnNames>[] = [];
    const templateMatchers: IListItem<ITemplateTemplateMatcherColumnNames>[] = [];

    if (template && template.matchers) {
        template.matchers.forEach((matcher, index) => {
            if (matcher.matcherValue.type === 'any') {
                anyMatchers.push({
                    id: index,
                    columns: {
                        type: 'any',
                        key: matcher.key,
                    },
                });
            } else if (matcher.matcherValue.type === 'fixed') {
                fixedMatchers.push({
                    id: index,
                    columns: {
                        type: 'fixed',
                        key: matcher.key,
                        value: matcher.matcherValue.value,
                    },
                });
            } else if (matcher.matcherValue.type === 'template') {
                templateMatchers.push({
                    id: index,
                    columns: {
                        type: 'template',
                        key: matcher.key,
                        templateName: matcher.matcherValue.templateName,
                        templateVersion: matcher.matcherValue.templateVersion,
                    },
                });
            }
        });
    }

    return [anyMatchers, fixedMatchers, templateMatchers];
}

export default observe([
    StateChangeNotification.I18N_TRANSLATIONS,
    StateChangeNotification.TEMPLATE_DETAIL,
], withRouter(TemplateDetail));
