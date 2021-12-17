import { IState } from 'models/state.models';
import { IDataset } from 'models/state/datasets.model';

export const getAsyncDatasetsEntitty = (state: IState) => state.entities.datasets;
export const getAsyncDatasetDetail = (state: IState) => state.entities.datasetDetail;
export const getAsyncDatasetImplementations = (state: IState) => state.entities.datasetImplementations;
export const getAsyncDatasetsPageData = (state: IState) => {
    const datasetsEntity = getAsyncDatasetsEntitty(state);
    return datasetsEntity && datasetsEntity.data ? datasetsEntity.data.page : null;
};
export const getAsyncDatasets = (state: IState) => {
    const datasetsEntity = getAsyncDatasetsEntitty(state);
    return datasetsEntity && datasetsEntity.data && datasetsEntity.data.datasets
        ? datasetsEntity.data.datasets : [] as IDataset[];
};
