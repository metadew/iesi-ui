import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { IObserveProps, observe } from 'views/observe';
import { Box, Collapse, createStyles, Typography, WithStyles, withStyles, Button } from '@material-ui/core';
import ContentWithSidePanel from 'views/common/layout/ContentWithSidePanel';
import { IDatasetBase, IDatasetImplementationColumn } from 'models/state/dataset.model';
import TextInput from 'views/common/input/TextInput';
import { getTranslator } from 'state/i18n/selectors';
import { getRouteKeyByPath, ROUTE_KEYS } from 'views/routes';
import { TRequiredFieldsState } from 'models/form.models';
import { IComponent } from 'models/state/components.model';
import Translate from '@snipsonian/react/es/components/i18n/Translate';
import { Alert } from '@material-ui/lab';
import DetailActions from 'views/design/ScriptDetail/DetailActions';
import GenericList from 'views/common/list/GenericList';
import { IListItem, ListColumns } from 'models/list.models';
import { Add, Edit } from '@material-ui/icons';

const styles = () => createStyles({});

type TProps = WithStyles<typeof styles>;

interface IComponentState {
    newDatasetDetail: IDatasetBase;
    hasChangesToCheck: boolean;
    isAddOpen: boolean;
    requiredFieldsState: TRequiredFieldsState<IComponent>;
}

const initialDatasetDetail: IDatasetBase = {
    name: '',
    implementations: [],
};

const DatasetDetail = withStyles(styles)(
    class extends React.Component<TProps & IObserveProps & RouteComponentProps, IComponentState> {
        public constructor(props: TProps & IObserveProps & RouteComponentProps) {
            super(props);
            this.state = {
                newDatasetDetail: initialDatasetDetail,
                hasChangesToCheck: false,
                isAddOpen: false,
                requiredFieldsState: {
                    name: {
                        showError: false,
                    },
                },
            };

            this.renderDatasetDetailPanel = this.renderDatasetDetailPanel.bind(this);
            this.renderDatasetDetailContent = this.renderDatasetDetailContent.bind(this);
            this.isCreateDatasetRoute = this.isCreateDatasetRoute.bind(this);
            this.updateDataset = this.updateDataset.bind(this);
        }

        public render() {
            return (
                <>
                    <ContentWithSidePanel
                        panel={this.renderDatasetDetailPanel()}
                        content={this.renderDatasetDetailContent()}
                        toggleLabel={<Translate msg="datasets.detail.side.toggle_button" />}
                    />
                </>
            );
        }

        private renderDatasetDetailPanel() {
            const { state } = this.props;
            const { newDatasetDetail, requiredFieldsState } = this.state;
            const translator = getTranslator(state);
            return (
                <Box mt={1} display="flex" flexDirection="column" flex="1 1 auto">
                    <Box flex="1 1 auto">
                        <form noValidate autoComplete="off">
                            <TextInput
                                id="dataset-name"
                                label={translator('datasets.detail.side.dataset_name')}
                                InputProps={{
                                    readOnly: !this.isCreateDatasetRoute() && newDatasetDetail !== undefined,
                                    disableUnderline: true,
                                }}
                                value={newDatasetDetail.name}
                                onChange={(e) => this.updateDataset({ name: e.target.value })}
                                required={this.isCreateDatasetRoute()}
                                error={requiredFieldsState.name.showError}
                                helperText={requiredFieldsState.name.showError && 'Dataset name is a required field'}

                            />
                        </form>
                    </Box>
                </Box>
            );
        }

        private renderDatasetDetailContent() {
            const { newDatasetDetail, hasChangesToCheck } = this.state;
            const { state } = this.props;
            const translator = getTranslator(state);
            const implementations = getParametersFromDatasetDetails(newDatasetDetail);
            const hasImplementations = implementations.length;

            if (!hasImplementations) {
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
                                <Translate msg="datasets.detail.main.no_implementations.title" />
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<Add />}
                                onClick={() => this.setState({ isAddOpen: true })}
                            >
                                <Translate msg="datasets.detail.main.no_implementations.button" />
                            </Button>
                        </Box>
                    </Box>
                );
            }

            const columns: ListColumns<IDatasetImplementationColumn> = {
                labels: {
                    label: <Translate msg="datasets.detail.main.list.labels.labels" />,
                    fixedWidth: '100%',
                },
            };
            return (
                <>
                    <Box>
                        <Collapse in={hasChangesToCheck}>
                            <Box marginX={2} marginBottom={2}>
                                <Alert severity="warning">
                                    <Translate msg="datasets.detail.main.alert.save_changes" />
                                </Alert>
                            </Box>
                        </Collapse>
                        <DetailActions
                            onSave={null}
                            onDelete={null}
                            onAdd={null}
                            isCreateRoute={this.isCreateDatasetRoute()}
                        />
                    </Box>
                    <Box marginY={1}>
                        <GenericList
                            listItems={implementations}
                            columns={columns}
                            listActions={[{
                                icon: <Edit />,
                                label: translator('components.detail.main.list.actions.edit'),
                                onClick: () => null,
                                hideAction: () => null,
                            }]}
                        />
                    </Box>
                </>
            );
        }

        private updateDataset(fieldsToUpdate: Partial<IDatasetBase>) {
            this.setState((prevState) => ({
                newDatasetDetail: {
                    ...prevState.newDatasetDetail,
                    ...fieldsToUpdate,
                },
                hasChangesToCheck: true,
            }));
        }

        private isCreateDatasetRoute() {
            const currentRouteKey = getRouteKeyByPath({ path: this.props.match.path });
            return currentRouteKey === ROUTE_KEYS.R_DATASET_NEW;
        }
    },
);

function getParametersFromDatasetDetails(detail: IDatasetBase) {
    const newListItems: IListItem<IDatasetImplementationColumn>[] = detail
        ? detail.implementations
            .map((implementation, index) => ({
                id: index,
                columns: {
                    labels: implementation.labels.map((label) => label.label).join(', '),
                },
                data: {},
                canBeDeleted: true,
            }))
        : [];

    return newListItems;
}

export default observe([], withRouter(DatasetDetail));
