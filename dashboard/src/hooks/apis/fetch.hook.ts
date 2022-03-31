import { useState, useCallback } from 'react';
import { FetchErrorResultData } from '@/types/helpers.type';
import { ApiHelpers } from '@/helpers/api.helper';

export const useFetchApi = <T>({
    apiPath,
    method,
    payload,
    initialData,
    callbackFunc,
}: {
    apiPath: string;
    method: string;
    payload?: { [key: string]: any };
    initialData: T | null;
    callbackFunc?: (data: T) => void;
}) => {
    const [data, setData] = useState<T | null>(initialData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<FetchErrorResultData | null>(null);

    const fetchApi = useCallback(async () => {
        try {
            setIsLoading(true);

            const result = await ApiHelpers.SendRequestWithToken<T>({
                apiPath,
                method,
                payload,
            });
            const data = result.data;

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

            // TODO: can handle global error ui here, e.g. open global error modal.
            alert(errorKey);
            // TODO: or just use error data to show on error section.
            setError(error);
        } finally {
            setIsLoading(false);
        }
    }, [apiPath, method, payload, callbackFunc]);

    return {
        isLoading,
        error,
        data,
        fetchApi,
    };
};
