import API_URLS from 'api/apiUrls';
// eslint-disable-next-line import/no-cycle
import { get, post, put, remove } from 'api/requestWrapper';
import FileSaver from 'file-saver';
import {
    IDataset,
    IDatasetBase,
    IDatasetByNamePayload,
    IDatasetByUuidPayload,
    IDatasetEntity,
    IDatasetImplementation,
    IDatasetImplementationsByUuidPayload,
    IDatasetImportPayload,
    IFetchDatasetsListPayload,
} from 'models/state/datasets.model';
import { IPageData } from 'models/state/iesiGeneric.models';

interface IDatasetsResponse {
    _embedded: {
        datasets: IDataset[];
    };
    page: IPageData;
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

export async function fetchDatasetDownload({ name }: IDatasetByNamePayload) {
    return get<any>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.DATASET_BY_NAME_DOWNLOAD,
        responseType: 'blob',
        pathParams: {
            name,
        },
    }).then((response) => {
        const blob = new Blob([response]);
        // eslint-disable-next-line
        FileSaver.saveAs(blob, 'dataset_' + name + '.json');
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

export async function createDatasetImport({ value }: IDatasetImportPayload) {
    return post<string | FormData>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.DATASETS_IMPORT,
        body: value,
        contentType: value instanceof FormData ? 'multipart/form-data' : 'text/plain',
        headers: {
            'Content-Type': value instanceof FormData ? 'multipart/form-data' : 'text/plain',
        },
        mapResponse: ({ data }) => data,
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

export function deleteDataset({ uuid }: IDatasetByUuidPayload) {
    return remove<{}>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.DATASET_BY_UUID,
        pathParams: {
            uuid,
        },
    });
}
