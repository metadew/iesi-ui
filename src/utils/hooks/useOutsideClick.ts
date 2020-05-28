import { useEffect, RefObject } from 'react';

interface IOutsideClick {
    ref: RefObject<HTMLDivElement>;
    callback: () => void;
}

const useOutsideClick = ({ ref, callback }: IOutsideClick) => {
    const handleClick = (e: Event) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
            callback();
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClick);

        return () => {
            document.removeEventListener('click', handleClick);
        };
    });
};

export default useOutsideClick;
