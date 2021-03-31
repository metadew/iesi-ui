import API_URLS from 'api/apiUrls';
import { post } from 'api/requestWrapper';
import { IOpenAPI, IOpenAPIEntity } from 'models/state/openapi.model';

export function transformDocumentation({ value }: IOpenAPI) {
    return post<IOpenAPIEntity>({
        needsAuthentication: true,
        isIesiApi: true,
        url: API_URLS.OPEN_API_TRANSFORM,
        body: value,
        contentType: value instanceof FormData ? 'multipart/form-data' : 'application/json',
        headers: {
            'Content-Type': value instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
    });
}
