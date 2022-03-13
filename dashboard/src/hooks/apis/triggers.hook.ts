import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { useFetchApi } from '@/hooks/apis/fetch.hook';
import { triggersActions } from '@/redux/reducers/triggers.reducer';
import {
    API_URL,
    END_POINT,
    HTTP_METHOD,
    RESPONSE_STATUS,
} from '@/constants/api';
import { TriggerItem } from '@/types/triggers.type';
import { ResponseOK } from '@/types/response.type';

interface GetTriggersResponse {
    triggers: TriggerItem[];
    rowNum: number;
}

export const useGetTriggersApi = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    const dispatch = useAppDispatch();
    const dispatchRefreshTriggers = useCallback(
        (data: GetTriggersResponse) => {
            if (data) {
                dispatch(triggersActions.refreshTriggers(data));
            }
        },
        [dispatch]
    );

    const apiPath = `${API_URL}${END_POINT.TRIGGERS}?page=${page}&limit=${limit}`;

    const { isLoading, error, fetchApi } = useFetchApi<GetTriggersResponse>({
        apiPath,
        method: HTTP_METHOD.GET,
        initialData: null,
        callbackFunc: dispatchRefreshTriggers,
    });

    return {
        isGettingTriggers: isLoading,
        getTriggersError: error,
        getTriggersApi: fetchApi,
    };
};

export const useGetTriggerApi = (id: number) => {
    const dispatch = useAppDispatch();
    const dispatchRefreshTrigger = useCallback(
        (data: TriggerItem) => {
            if (data) {
                dispatch(triggersActions.refreshTrigger(data));
            }
        },
        [dispatch]
    );

    let apiPath = `${API_URL}${END_POINT.TRIGGER}`;
    apiPath = apiPath.replace(':id', id.toString());

    const { isLoading, error, fetchApi } = useFetchApi<TriggerItem>({
        apiPath,
        method: HTTP_METHOD.GET,
        initialData: null,
        callbackFunc: dispatchRefreshTrigger,
    });

    return {
        isGettingTrigger: isLoading,
        getTriggerError: error,
        getTriggerApi: fetchApi,
    };
};

export const useDeleteTriggersApi = (ids: number[]) => {
    const dispatch = useAppDispatch();
    const dispatchRefresh = useCallback(
        (data: ResponseOK) => {
            if (data.status === RESPONSE_STATUS.OK) {
                dispatch(triggersActions.deleteTriggers(ids));
            }
        },
        [ids, dispatch]
    );

    const apiPath = `${API_URL}${END_POINT.TRIGGERS}`;

    const { isLoading, error, data, fetchApi } = useFetchApi<ResponseOK>({
        apiPath,
        method: HTTP_METHOD.DELETE,
        payload: ids,
        initialData: null,
        callbackFunc: dispatchRefresh,
    });

    return {
        isDeletingTriggers: isLoading,
        deleteTriggersError: error,
        deleteTriggersResponse: data,
        deleteTriggersApi: fetchApi,
    };
};
