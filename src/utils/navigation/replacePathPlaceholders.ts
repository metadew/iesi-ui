import { IPathParams } from 'models/router.models';

export default function replacePathPlaceholders({
    path,
    placeholders = {},
}: {
    path: string;
    placeholders?: IPathParams;
}): string {
    const placeholderNames = Object.getOwnPropertyNames(placeholders);

    return placeholderNames.reduce(
        (prevPathResult, placeholderName) => {
            const placeholderValue = placeholders[placeholderName];

            const regex = new RegExp(`:${placeholderName}`, 'g');

            return prevPathResult.replace(regex, placeholderValue && placeholderValue.toString());
        },
        path,
    );
}
