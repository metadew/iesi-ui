import { IState } from 'models/state.models';
import { FilterType } from 'models/list.models';
import { TTranslatorComponent } from 'models/i18n.models';

export interface IFilterConfigItem {
    label: TTranslatorComponent;
    filterType: FilterType;
    getDropdownOptions?: (state: IState) => string[];
}
