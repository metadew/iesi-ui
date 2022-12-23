import { IState } from 'models/state.models';
import { IComponent } from 'models/state/components.model';
import { getUniqueIdFromComponent } from 'utils/components/componentUtils';

export const getAsyncComponentsEntity = (state: IState) => state.entities.components;

export const getAsyncComponents = (state: IState) => {
    const componentsEntity = getAsyncComponentsEntity(state);
    return componentsEntity && componentsEntity.data && componentsEntity.data.components
        ? componentsEntity.data.components : [] as IComponent[];
};

export const getAsyncComponentsPageData = (state: IState) => {
    const componentsEntity = getAsyncComponentsEntity(state);
    return componentsEntity && componentsEntity.data ? componentsEntity.data.page : null;
};

export const getAsyncComponentDetail = (state: IState) => state.entities.componentDetail;

export const getComponentByUniqueIdFromDetailOrList = (state: IState, uniqueId: string) => {
    const componentDetail = getAsyncComponentDetail(state);
    if (componentDetail.data && getUniqueIdFromComponent(componentDetail.data) === uniqueId) {
        return componentDetail.data;
    }
    const components = getAsyncComponents(state);
    return components.find((component) => getUniqueIdFromComponent(component) === uniqueId);
};
