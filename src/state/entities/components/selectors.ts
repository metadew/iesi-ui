import { IState } from 'models/state.models';
import { IComponent } from 'models/state/components.model';

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
