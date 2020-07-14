interface IRequiredFieldState {
    showError: boolean;
}

export type TRequiredFields<Data> = (keyof Partial<Data>)[];

export type TRequiredFieldsState<Data> = {
    [P in keyof Partial<Data>]: IRequiredFieldState;
};
