import { IDataset } from 'models/state/datasets.model';

export function getUniqueIdFromDataset(dataset: IDataset) {
    return dataset ? dataset.uuid : null;
}
