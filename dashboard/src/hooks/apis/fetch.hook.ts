import { useState, useCallback } from 'react';
import { FetchResult } from '@/types/helpers.type';

export const useFetchApi = <T>({
    initialData,
    fetchMethod,
    callbackFunc,
}: {
    initialData: T | null;
    fetchMethod: () => Promise<T>;
    callbackFunc?: (data: T) => void;
}) => {
    const [data, setData] = useState<T | null>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<FetchResult | null>(null);

    const fetchApi = useCallback(async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);

            const data: T = await fetchMethod();
            if (callbackFunc) {
                callbackFunc(data);
            }

            setData(data);
        } catch (err: any) {
            // TODO: will handle error ui here, e.g. open global error modal.
            console.log({ err });
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, fetchMethod, callbackFunc]);

    return {
        isLoading,
        error,
        data,
        fetchApi,
    };
};
