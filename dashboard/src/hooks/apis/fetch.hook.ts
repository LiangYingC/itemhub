import { useState, useCallback } from 'react';

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
    const [error, setError] = useState(null);

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
            // 未來將錯誤處理邏輯整合於此
            setError(err.toString());
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
