import debounce from 'lodash.debounce';
import { useRef, useEffect, useCallback } from 'react';

export function useDebounce(callback: () => void, delay: number) {
    const inputsRef = useRef({ callback, delay });
    useEffect(() => {
        inputsRef.current = { callback, delay };
    });
    return useCallback(
        debounce(
            () => {
                if (inputsRef.current.delay === delay)
                    inputsRef.current.callback();
            },
            delay,
            {}
        ),
        [delay, debounce]
    );
}
