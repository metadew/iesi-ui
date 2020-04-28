import { useRef, useEffect } from 'react';

export function usePrevious<T = {}>(value: T): T {
    const ref = useRef<T>(null);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}
