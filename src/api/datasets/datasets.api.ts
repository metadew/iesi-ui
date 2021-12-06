import API_URLS from 'api/apiUrls';
import { get, post } from 'api/requestWrapper';
import { IDataset, IDatasetBase, IDatasetByNamePayload } from 'models/state/datasets.model';
import { IPageData } from 'models/state/iesiGeneric.models';

interface IDatasetsResponse {
    _embedded: {
        datasets: IDataset[];
    };
    page: IPageData;
}

export function fetchDataset({ name }: IDatasetByNamePayload) {
    return get<IDataset>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.DATASET_BY_NAME,
        pathParams: {
            name,
        },
        mapResponse: ({ data }) => data,
    });
}
export function createDataset(dataset: IDatasetBase) {
    return post<IDatasetBase>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.DATASETS,
        body: dataset,
        contentType: 'application/json',
    });
}
