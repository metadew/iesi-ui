export interface IDatasetBase {
    name: string;
    implementations: IDatasetImplementation[];
}

export interface IDatasetImplementation {
    type: string;
    labels: IDatasetImplementationLabel[];
}

export interface IDatasetImplementationLabel {
    label: string;
}

export interface IDataset extends IDatasetBase {
    uuid: string;
}

export interface IDatasetImplementationColumn {
    labels: string;
}
