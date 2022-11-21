import { IPathParams } from 'models/router.models';

export default function replacePathPlaceholders({
    path,
    placeholders = {},
    queryParams = {},
}: {
    path: string;
    placeholders?: IPathParams;
    queryParams?: IPathParams;
}): string {
    const placeholderNames = Object.getOwnPropertyNames(placeholders);

    const updatedPath = placeholderNames.reduce(
        (prevPathResult, placeholderName) => {
            const placeholderValue = placeholders[placeholderName];

            const regex = new RegExp(`:${placeholderName}\\??`, 'g');

            return typeof placeholderValue === 'undefined'
                ? prevPathResult
                : prevPathResult.replace(regex, placeholderValue && placeholderValue.toString());
        },
        path,
    );

    return addQueryParams({ path: updatedPath, queryParams });
}

function addQueryParams({ path, queryParams }: {
    path: string;
    queryParams: {
        [key: string]: string | number;
    };
}) {
    return removeOptionalPathPlaceholdersIfNotSet({
        path: path
            .split('')
            .concat(Object.getOwnPropertyNames(queryParams).map((queryParam, index) => {
                if (index === 0 && !path.includes('?')) {
                    return `?${queryParam}=${queryParams[queryParam]}`;
                }
                return `&${queryParam}=${queryParams[queryParam]}`;
            }))
            .join(''),
    });
}

function removeOptionalPathPlaceholdersIfNotSet({ path }: {
    path: string;
}): string {
    const regex = new RegExp('\\/:\\w*\\?', 'g');
    return path.replace(regex, '');
}
