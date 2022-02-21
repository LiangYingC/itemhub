import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { useFetchApi } from '@/hooks/apis/fetch.hook';
import { oauthClientsActions } from '@/redux/reducers/oauth-clients.reducer';
import {
    API_URL,
    END_POINT,
    HTTP_METHOD,
    RESPONSE_STATUS,
} from '@/constants/api';
import { ApiHelpers } from '@/helpers/api.helper';

export const useGetOauthClients = ({
    page,
    limit,
}: {
    page: number;
    limit: number;
}) => {
    const fetchMethod = useCallback(async () => {
        const apiPath = `${API_URL}${END_POINT.OAUTH_CLIENTS}?page=${page}&limit=${limit}`;
        const result = await ApiHelpers.SendRequestWithToken<any>({
            apiPath,
            method: HTTP_METHOD.GET,
        });
        return result.data;
    }, [page, limit]);

    const dispatch = useAppDispatch();
    const dispatchRefresh = useCallback(
        (data: any) => {
            if (data) {
                dispatch(oauthClientsActions.refresh(data.oauthClients));
            }
        },
        [dispatch]
    );

    return useFetchApi<any>({
        initialData: null,
        fetchMethod,
        callbackFunc: dispatchRefresh,
    });
};

export const useGetOauthClient = (id: number) => {
    const fetchMethod = useCallback(async () => {
        let apiPath = `${API_URL}${END_POINT.OAUTH_CLIENT}`;
        apiPath = apiPath.replace(':id', id.toString());
        const result = await ApiHelpers.SendRequestWithToken<any>({
            apiPath,
            method: HTTP_METHOD.GET,
        });
        return result.data;
    }, [id]);

    const dispatch = useAppDispatch();
    const dispatchRefresh = useCallback(
        (data: any) => {
            if (data) {
                dispatch(oauthClientsActions.refreshOne(data));
            }
        },
        [dispatch]
    );

    return useFetchApi<any>({
        initialData: null,
        fetchMethod,
        callbackFunc: dispatchRefresh,
    });
};

export const useUpdateOauthClient = ({
    id,
    clientId,
}: {
    id: number;
    clientId: string;
}) => {
    const fetchMethod = useCallback(async () => {
        let apiPath = `${API_URL}${END_POINT.OAUTH_CLIENT}`;
        apiPath = apiPath.replace(':id', id.toString());
        const result = await ApiHelpers.SendRequestWithToken<any>({
            apiPath,
            method: HTTP_METHOD.PATCH,
            payload: {
                clientId,
            },
        });
        return result.data;
    }, [id, clientId]);

    const dispatch = useAppDispatch();
    const dispatchRefresh = useCallback(
        (data: any) => {
            if (data.status === RESPONSE_STATUS.OK) {
                dispatch(
                    oauthClientsActions.updateOne({
                        clientId,
                        id,
                    })
                );
            }
        },
        [clientId, id, dispatch]
    );

    return useFetchApi<any>({
        initialData: null,
        fetchMethod,
        callbackFunc: dispatchRefresh,
    });
};

export const useRevokeSecretOauthClient = (id: number) => {
    const fetchMethod = useCallback(async () => {
        let apiPath = `${API_URL}${END_POINT.OAUTH_CLIENT_REVOKE_SECRET}`;
        apiPath = apiPath.replace(':id', id.toString());
        const result = await ApiHelpers.SendRequestWithToken<any>({
            apiPath,
            method: HTTP_METHOD.POST,
        });
        return result.data;
    }, [id]);

    const dispatch = useAppDispatch();
    const dispatchRefresh = useCallback(
        (data: any) => {
            if (data.status === RESPONSE_STATUS.OK) {
                dispatch(
                    oauthClientsActions.updateOne({
                        id,
                    })
                );
            }
        },
        [id, dispatch]
    );

    return useFetchApi<any>({
        initialData: null,
        fetchMethod,
        callbackFunc: dispatchRefresh,
    });
};

export const useDeleteOauthClients = (ids: number[]) => {
    const fetchMethod = useCallback(async () => {
        const apiPath = `${API_URL}${END_POINT.OAUTH_CLIENTS}`;
        const result = await ApiHelpers.SendRequestWithToken<any>({
            apiPath,
            method: HTTP_METHOD.DELETE,
            payload: ids,
        });
        return result.data;
    }, [ids]);

    const dispatch = useAppDispatch();
    const dispatchRefresh = useCallback(
        (data: any) => {
            if (data.status === RESPONSE_STATUS.OK) {
                dispatch(
                    oauthClientsActions.deleteMultiple({
                        ids,
                    })
                );
            }
        },
        [ids, dispatch]
    );

    return useFetchApi<any>({
        initialData: null,
        fetchMethod,
        callbackFunc: dispatchRefresh,
    });
};
