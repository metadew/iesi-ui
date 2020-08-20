import { useEffect } from 'react';
import { getStore } from 'state';

interface IExecuteOnUnmount {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: () => any;
    dispatchResult?: boolean; // default false
}

export default function useExecuteOnUnmount(...executeOnUnmount: IExecuteOnUnmount[]) {
    useEffect(
        () => {
            if (executeOnUnmount && executeOnUnmount.length > 0) {
                return function cleanupOnUnmount() {
                    executeOnUnmount.forEach(({ execute, dispatchResult }) => {
                        const result = execute();

                        if (dispatchResult) {
                            getStore().dispatch(result);
                        }
                    });
                };
            }

            return undefined;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
        /* this empty array causes the effect to run only once after first render (doing nothing)
           and once just before the unmount */
    );
}
