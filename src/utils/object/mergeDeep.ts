/* eslint-disable @typescript-eslint/no-explicit-any */

function isObject(item: any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export default function mergeDeep(target: { [key: string]: any }, ...sources: object[]): object {
    if (!sources.length) return target;
    const source: { [key: string]: any } = sources.shift();

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        });
    }

    return mergeDeep(target, ...sources);
}
