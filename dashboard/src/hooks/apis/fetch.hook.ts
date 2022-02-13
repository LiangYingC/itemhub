import { useState, useCallback } from 'react';
import { FetchErrorResultData } from '@/types/helpers.type';

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
    const [error, setError] = useState<FetchErrorResultData | null>(null);

    const fetchApi = useCallback(async () => {
        if (isLoading) return;

        try {
            setIsLoading(true);

            const data: T = await fetchMethod();
            if (callbackFunc) {
                callbackFunc(data);
            }

            setData(data);
        } catch (error: any) {
            const errorData: FetchErrorResultData = error?.data || {
                errorKey: 'UNKNOWN_ERROR',
                message: '非預期錯誤',
                payload: [],
                stackTrace: '',
            };
            const errorKey = errorData.errorKey;

            // TODO: will handle error ui here, e.g. open global error modal.
            alert(errorKey);
            setError(error);
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
