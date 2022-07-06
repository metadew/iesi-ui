import { IState } from 'models/state.models';
import { ITemplate } from 'models/state/templates.model';

export const getAsyncTemplatesEntity = (state: IState) => state.entities.templates;

export const getAsyncTemplates = (state: IState) => {
    const templatesEntity = getAsyncTemplatesEntity(state);
    return templatesEntity
        && templatesEntity.data
        && templatesEntity.data.templates
        ? templatesEntity.data.templates
        : []as ITemplate[];
};

export const getTemplatesForDropdown = (state: IState) => {
    const asyncTemplates = getAsyncTemplatesEntity(state);
    const templates = asyncTemplates.data.templates || [] as ITemplate[];
    return templates.map((template) => template.name);
};

export const getAsyncTemplatesPageData = (state: IState) => {
    const templatesEntity = getAsyncTemplatesEntity(state);
    return templatesEntity && templatesEntity.data ? templatesEntity.data.page : null;
};

export const getAsyncTemplateDetail = (state: IState) => state.entities.templateDetail;
