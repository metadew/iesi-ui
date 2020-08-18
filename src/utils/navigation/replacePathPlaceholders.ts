import { IPathParams } from 'models/router.models';

export default function replacePathPlaceholders({
    path,
    placeholders = {},
}: {
    path: string;
    placeholders?: IPathParams;
}): string {
    const placeholderNames = Object.getOwnPropertyNames(placeholders);

    const updatedPath = placeholderNames.reduce(
        (prevPathResult, placeholderName) => {
            const placeholderValue = placeholders[placeholderName];

            const regex = new RegExp(`:${placeholderName}\\??`, 'g');

            return !placeholderValue
                ? prevPathResult
                : prevPathResult.replace(regex, placeholderValue && placeholderValue.toString());
        },
        path,
    );

    return removeOptionalPathPlaceholdersIfNotSet({ path: updatedPath });
}


function removeOptionalPathPlaceholdersIfNotSet({ path }: {
    path: string;
}): string {
    const regex = new RegExp('\\/:\\w*\\?', 'g');
    return path.replace(regex, '');
}
