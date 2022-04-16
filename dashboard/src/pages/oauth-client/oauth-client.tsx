import { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import {
    useCreateOauthClients,
    useGetOauthClient,
    useRevokeSecretOauthClient,
} from '@/hooks/apis/oauth-clients.hook';
import { selectOauthClients } from '@/redux/reducers/oauth-clients.reducer';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    useUpdateOauthClient,
    useDeleteOauthClients,
} from '@/hooks/apis/oauth-clients.hook';
import { RESPONSE_STATUS } from '@/constants/api';
import PageTitle from '@/components/page-title/page-title';

interface OauthClientLocationState {
    secret: string;
}

const OauthClient = () => {
    const { id: idFromUrl } = useParams();
    const { state } = useLocation();
    const id: number | null = idFromUrl ? Number(idFromUrl) : null;
    const isCreateMode = id === null;

    const navigate = useNavigate();

    const { oauthClients } = useAppSelector(selectOauthClients);

    const oauthClient = (oauthClients || []).filter(
        (item) => item.id === Number(id)
    )[0];
    const oauthClientId = oauthClient ? oauthClient.clientId : '';

    const [clientId, setClientId] = useState(oauthClientId);

    const { isLoading: isGetting, fetchApi: getApi } = useGetOauthClient(
        Number(id)
    );

    const { fetchApi: updateApi, isLoading: isUpdating } = useUpdateOauthClient(
        { id: Number(id), clientId }
    );

    const {
        fetchApi: revokeSecretApi,
        isLoading: isRevoking,
        data: revokeSecretResponse,
    } = useRevokeSecretOauthClient(Number(id));

    const {
        fetchApi: deleteMultipleApi,
        isLoading: isDeleting,
        data: deleteOAuthClientResponse,
    } = useDeleteOauthClients([Number(id)]);

    const {
        fetchApi: createApi,
        isLoading: isCreating,
        data: createOAuthClientResponse,
    } = useCreateOauthClients(clientId);

    useEffect(() => {
        if (oauthClient || isDeleting || isCreateMode) {
            return;
        }
        getApi();
    }, [getApi, oauthClient, isDeleting, isCreateMode]);

    useEffect(() => {
        setClientId(oauthClientId);
    }, [oauthClientId]);

    useEffect(() => {
        if (deleteOAuthClientResponse?.status === RESPONSE_STATUS.OK) {
            navigate('/dashboard/oauth-clients', { replace: true });
        }
    }, [navigate, deleteOAuthClientResponse]);

    useEffect(() => {
        if (createOAuthClientResponse && !isNaN(createOAuthClientResponse.id)) {
            navigate(
                `/dashboard/oauth-clients/${createOAuthClientResponse?.id}`,
                {
                    replace: false,
                    state: {
                        secret: createOAuthClientResponse.clientSecrets,
                    },
                }
            );
        }
    }, [navigate, createOAuthClientResponse]);

    return (
        <div className="oauth-client" data-testid="oauth-client">
            <PageTitle title={`oAuth Client - ${clientId}`} />
            <div className="card mx-4 p-45">
                {isGetting ? (
                    <div>Loading</div>
                ) : (
                    <div className="p-4">
                        <div>{oauthClient?.id}</div>
                        <input
                            type="text"
                            className="form-control"
                            value={clientId}
                            placeholder="如果不填寫 clientId 系統會自動會幫你隨機產生"
                            onChange={(e) => setClientId(e.target.value)}
                        />
                        {isCreateMode ? (
                            <div>
                                <button
                                    disabled={isCreating}
                                    onClick={createApi}
                                >
                                    Create
                                </button>
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="****************************"
                                    value={
                                        revokeSecretResponse?.secret ||
                                        (state as OauthClientLocationState)
                                            ?.secret
                                    }
                                    disabled
                                />
                                <button
                                    className="btn rounded-pill bg-white mx-2"
                                    disabled={isDeleting}
                                    onClick={deleteMultipleApi}
                                >
                                    {isDeleting ? 'Deleting' : 'Delete'}
                                </button>
                                <button
                                    className="btn rounded-pill bg-white mx-2"
                                    disabled={isUpdating}
                                    onClick={updateApi}
                                >
                                    {isUpdating ? 'Updating' : 'Update'}
                                </button>
                                <button
                                    className="btn rounded-pill bg-white mx-2"
                                    disabled={isRevoking}
                                    onClick={revokeSecretApi}
                                >
                                    {isRevoking
                                        ? 'Revoking'
                                        : 'Revoke Client Secret'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OauthClient;
