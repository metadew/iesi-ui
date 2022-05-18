import {
    IActionType,
    IComponentType,
    IConnectionType,
    IConstantParameter } from 'models/state/constants.models';
import { get } from 'api/requestWrapper';
import API_URLS from '../apiUrls';

interface IActionTypeResponse {
    name: string;
    description: string;
    status: string;
    parameters: IConstantParameter[];
}

interface IConnectionTypeResponse {
    name: string;
    description: string;
    parameters: IConstantParameter[];
}

interface IEnvironmentTypeResponse {
    name: string;
    description: string;
    parameters: IConstantParameter[];
}

interface IComponentTypeResponse {
    name: string;
    description: string;
    parameters: IConstantParameter[];
}

export function fetchActionTypes() {
    return get<IActionType[], IActionTypeResponse[]>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.ACTION_TYPES,
        // eslint-disable-next-line arrow-body-style
        mapResponse: ({ data }) => {
            return data.map((action) => ({
                category: action.name.split('.')[0],
                type: action.name,
                name: action.description,
                parameters: action.parameters,
                status: action.status,
            }));
        },
    });
}

export function fetchConnectionTypes() {
    return get<IConnectionType[], IConnectionTypeResponse[]>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.CONNECTION_TYPES,
        // eslint-disable-next-line arrow-body-style
        mapResponse: ({ data }) => {
            return data.map((connection) => ({
                category: connection.name.split('.')[0],
                type: connection.name,
                name: connection.description,
                parameters: connection.parameters,
            }));
        },
    });
}

export function fetchComponentTypes() {
    return get<IComponentType[], IComponentTypeResponse[]>({
        isIesiApi: true,
        needsAuthentication: true,
        url: API_URLS.COMPONENT_TYPES,
        // eslint-disable-next-line arrow-body-style
        mapResponse: ({ data }) => {
            return data.map((component) => ({
                category: component.name.split('.')[0],
                type: component.name,
                name: component.description,
                parameters: component.parameters,
            }));
        },
    });
}
