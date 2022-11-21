import { TRequiredFields, TRequiredFieldsState } from 'models/form.models';

export default function requiredFieldsCheck<Data = {}>({
    data,
    requiredFields,
}: {
    data: Data;
    requiredFields: TRequiredFields<Data>;
}): { passed: boolean; requiredFieldsState: TRequiredFieldsState<Data> } {
    let passed = true;
    const requiredFieldsState = Object.keys(data).reduce((state, key) => {
        if (requiredFields.includes(key as keyof Data)) {
            const newState = { ...state };
            const fieldValue = data[key as keyof Data];

            if (fieldValue === null || fieldValue === undefined) {
                passed = false;
            }

            newState[key as keyof Data] = {
                showError: fieldValue === null || fieldValue === undefined,
            };

            return newState;
        }
        return state;
    }, {} as TRequiredFieldsState<Data>);

    return { passed, requiredFieldsState };
}
