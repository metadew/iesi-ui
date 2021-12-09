import API_URLS from 'api/apiUrls';
import { get, post, put } from 'api/requestWrapper';
import {
    IDataset,
    IDatasetBase,
    IDatasetByNamePayload,
    IDatasetEntity,
    IDatasetImplementation,
    IDatasetImplementationsByUuidPayload,
    IFetchDatasetsListPayload,
} from 'models/state/datasets.model';
import { IPageData } from 'models/state/iesiGeneric.models';

interface IDatasetsResponse {
    _embedded: {
        datasets: IDataset[];
    };
    page: IPageData;
}

interface IDatasetResponse {
    uuid: string;
    name: string;
    securityGroupName: string;
    implementations: string[];
}

export function fetchDatasets({ pagination, filter, sort }: IFetchDatasetsListPayload) {
    return get<IDatasetEntity, IDatasetsResponse>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.DATASETS,
        queryParams: {
            ...pagination,
            ...filter,
            sort,
        },
        mapResponse: ({ data }) => ({
            // eslint-disable-next-line no-underscore-dangle
            datasets: data._embedded.datasets,
            page: data.page,
        }),
    });
}

export function fetchDataset({ name }: IDatasetByNamePayload) {
    return get<IDatasetBase>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.DATASET_BY_NAME,
        pathParams: {
            name,
        },
        mapResponse: ({ data }) => ({ ...data, implementations: null }),
    });
}

export function fetchDatasetImplementations({ uuid }: IDatasetImplementationsByUuidPayload) {
    return get<IDatasetImplementation[]>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.DATASET_IMPLEMENTATIONS,
        pathParams: {
            uuid,
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

export function updateDataset(dataset: IDataset) {
    return put<IDataset>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.DATASET_BY_UUID,
        body: dataset,
        pathParams: {
            uuid: dataset.uuid,
        },
        contentType: 'application/json',
    });
}
