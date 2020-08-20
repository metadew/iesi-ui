import { useEffect } from 'react';
import { getStore } from 'state';

interface IExecuteOnMount {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    execute: () => any;
    dispatchResult?: boolean; // default false
    cleanupOnUnmount?: TCleanupOnUnmount;
}

export type TCleanupOnUnmount = () => void;

export default function useExecuteOnMount(...executeOnMount: IExecuteOnMount[]) {
    useEffect(
        () => {
            if (executeOnMount && executeOnMount.length > 0) {
                const cleanups: TCleanupOnUnmount[] = [];

                executeOnMount.forEach(({ execute, dispatchResult, cleanupOnUnmount }) => {
                    if (cleanupOnUnmount) {
                        cleanups.push(cleanupOnUnmount);
                    }

                    const result = execute();

                    if (dispatchResult) {
                        getStore().dispatch(result);
                    }
                });

                return function cleanup() {
                    cleanups.forEach((singleCleanup) => {
                        singleCleanup();
                    });
                };
            }

            return undefined;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [], /* this empty array causes the effect to run (and cleanup) only once (= after first render) */
    );
}
