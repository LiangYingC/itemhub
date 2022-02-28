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
import { ApiHelpers } from '@/helpers/api.helper';
import { TriggerItem } from '@/types/triggers.type';
import { ResponseStatus } from '@/types/response.type';

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
    const fetchGetTriggers = useCallback(async () => {
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
        fetchMethod: fetchGetTriggers,
        callbackFunc: dispatchRefreshTriggers,
    });

    return {
        isGettingTriggers: isLoading,
        getTriggersError: error,
        getTriggersApi: fetchApi,
    };
};

export const useGetTriggerApi = (id: number) => {
    const fetchGetTrigger = useCallback(async () => {
        let apiPath = `${API_URL}${END_POINT.TRIGGER}`;
        apiPath = apiPath.replace(':id', id.toString());

        // const result = await ApiHelpers.SendRequestWithToken<TriggerItem>({
        //     apiPath,
        //     method: HTTP_METHOD.GET,
        // });

        /**
         * 目前 API 尚未實作完成，先吐假資料，待接下來實作 API 後，
         * 再把打開上面打 API 的程式、下面 return 拔掉，直接回傳 “result.data” 即可。
         * */
        return {
            createdAt: '2022-01-09T22:44:58',
            deletedAt: null,
            destinationDevice: {},
            destinationDeviceId: 60,
            destinationDeviceSourceState: 0,
            destinationDeviceTargetState: 1,
            destinationPin: 'D3',
            editedAt: null,
            id: 2,
            operator: 0,
            ownerId: 23,
            sourceDevice: {},
            sourceDeviceId: 60,
            sourcePin: 'D2',
            sourceThreshold: 62,
        } as TriggerItem;
    }, [id]);

    const dispatch = useAppDispatch();
    const dispatchRefreshTrigger = useCallback(
        (data: TriggerItem) => {
            if (data) {
                dispatch(triggersActions.refreshTrigger(data));
            }
        },
        [dispatch]
    );

    const { isLoading, error, fetchApi } = useFetchApi<TriggerItem>({
        initialData: null,
        fetchMethod: fetchGetTrigger,
        callbackFunc: dispatchRefreshTrigger,
    });

    return {
        isGettingTrigger: isLoading,
        getTriggerError: error,
        getTriggerApi: fetchApi,
    };
};

export const useDeleteTriggersApi = (ids: number[]) => {
    const fetchDeleteTriggers = useCallback(async () => {
        const apiPath = `${API_URL}${END_POINT.TRIGGERS}`;
        const result = await ApiHelpers.SendRequestWithToken<ResponseStatus>({
            apiPath,
            method: HTTP_METHOD.DELETE,
            payload: ids,
        });
        return result.data;
    }, [ids]);

    const dispatch = useAppDispatch();
    const dispatchRefresh = useCallback(
        (data: ResponseStatus) => {
            if (data.status === RESPONSE_STATUS.OK) {
                dispatch(triggersActions.deleteTriggers(ids));
            }
        },
        [ids, dispatch]
    );

    const { isLoading, error, data, fetchApi } = useFetchApi<ResponseStatus>({
        initialData: null,
        fetchMethod: fetchDeleteTriggers,
        callbackFunc: dispatchRefresh,
    });

    return {
        isDeletingTriggers: isLoading,
        deletingTriggersError: error,
        deletingTriggersResponse: data,
        deletingTriggersApi: fetchApi,
    };
};
