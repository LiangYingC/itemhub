import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { useFetchApi } from '@/hooks/apis/fetch.hook';
import { triggersActions } from '@/redux/reducers/triggers.reducer';
import { API_URL, END_POINT, HTTP_METHOD } from '@/constants/api';
import { ApiHelpers } from '@/helpers/api.helper';
import { TriggerItem } from '@/types/triggers.type';

interface GetTriggersResponse {
    triggers: TriggerItem[];
    rowNums: number;
}

export const useGetTriggersApi = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    const fetchGetTriggersMethod = useCallback(async () => {
        const apiPath = `${API_URL}${END_POINT.TRIGGERS}?page=${page}&limit=${limit}`;
        const result =
            await ApiHelpers.SendRequestWithToken<GetTriggersResponse>({
                apiPath,
                method: HTTP_METHOD.GET,
            });
        return result.data;
    }, [page, limit]);

    const dispatch = useAppDispatch();
    const dispatchRefreshTriggers = useCallback(
        (data: GetTriggersResponse) => {
            if (data) {
                dispatch(triggersActions.refreshTriggers(data));
            }
        },
        [dispatch]
    );

    const { isLoading, error, fetchApi } = useFetchApi<GetTriggersResponse>({
        initialData: null,
        fetchMethod: fetchGetTriggersMethod,
        callbackFunc: dispatchRefreshTriggers,
    });

    return {
        isGettingTriggers: isLoading,
        getTriggersError: error,
        getTriggersApi: fetchApi,
    };
};
