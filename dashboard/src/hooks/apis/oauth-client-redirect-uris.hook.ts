import { useCallback } from 'react';
import { useAppDispatch } from '@/hooks/redux.hook';
import { useFetchApi } from '@/hooks/apis/fetch.hook';
import { oauthClientsActions } from '@/redux/reducers/oauth-clients.reducer';
import { ApiHelpers } from '@/helpers/api.helper';
import {
    API_URL,
    END_POINT,
    HTTP_METHOD,
    RESPONSE_STATUS,
} from '@/constants/api';
import { OauthClient } from '@/types/oauth-clients.type';
import { ResponseOK } from '@/types/response.type';
import { OauthClientRedirectUri } from '@/types/oauth-client-redirect-uris.type';
import { oauthClientRedirctUrisActions } from '@/redux/reducers/oauth-client-redirect-uris.reducer';

export const useGetOauthClientRedirectUris = (oauthClientId: number) => {
    const dispatch = useAppDispatch();
    const dispatchRefresh = useCallback(
        (data: OauthClientRedirectUri[]) => {
            if (data) {
                dispatch(oauthClientRedirctUrisActions.refresh(data));
            }
        },
        [dispatch]
    );

    let apiPath = `${API_URL}${END_POINT.OAUTH_CLIENT_REDIRECT_URIS}`;
    apiPath = apiPath.replace(':id', oauthClientId.toString());

    return useFetchApi<OauthClientRedirectUri[]>({
        apiPath,
        method: HTTP_METHOD.GET,
        initialData: null,
        callbackFunc: dispatchRefresh,
    });
};

export const useCreateOauthClientRedirectUris = ({
    oauthClientId,
    uris,
}: {
    oauthClientId: number;
    uris: string[];
}) => {
    const dispatch = useAppDispatch();
    const dispatchAddMultiple = useCallback(
        (data: OauthClientRedirectUri[]) => {
            if (data) {
                dispatch(oauthClientRedirctUrisActions.appendMultiple(data));
            }
        },
        [dispatch]
    );

    let apiPath = `${API_URL}${END_POINT.OAUTH_CLIENT_REDIRECT_URIS}`;
    apiPath = apiPath.replace(':id', oauthClientId.toString());

    return useFetchApi<OauthClientRedirectUri[]>({
        apiPath,
        method: HTTP_METHOD.POST,
        payload: uris,
        initialData: null,
        callbackFunc: dispatchAddMultiple,
    });
};

export const useDeleteOauthClientRedirectUris = ({
    oauthClientId,
    ids,
}: {
    oauthClientId: number;
    ids: number[];
}) => {
    const dispatch = useAppDispatch();
    const dispatchRefresh = useCallback(
        (data: ResponseOK) => {
            if (data.status === 'OK') {
                dispatch(oauthClientRedirctUrisActions.deleteMultiple(ids));
            }
        },
        [dispatch, ids]
    );

    let apiPath = `${API_URL}${END_POINT.OAUTH_CLIENT_REDIRECT_URIS}`;
    apiPath = apiPath.replace(':id', oauthClientId.toString());

    return useFetchApi<ResponseOK>({
        apiPath,
        method: HTTP_METHOD.DELETE,
        payload: ids,
        initialData: null,
        callbackFunc: dispatchRefresh,
    });
};
