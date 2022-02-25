import styles from './oauth-client.module.scss';
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

interface OauthClientLocationState {
    secret: string;
}

const OauthClient = () => {
    const { id: idFromUrl } = useParams();
    const { state } = useLocation();
    const id: number | null = idFromUrl ? Number(idFromUrl) : null;
    const isCrateMode = id === null;

    const navigate = useNavigate();

    const list = useAppSelector(selectOauthClients);

    const oauthClient = (list || []).filter(
        (item) => item.id === Number(id)
    )[0];

    const oauthClientId = oauthClient ? oauthClient.clientId : '';

    const [clientId, setClientId] = useState(oauthClientId);

    const { isLoading, fetchApi } = useGetOauthClient(Number(id));
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
        if (oauthClient || id === null) {
            return;
        }
        fetchApi();
    }, [fetchApi, oauthClient, id]);

    useEffect(() => {
        setClientId(oauthClientId);
    }, [oauthClientId]);

    useEffect(() => {
        if (deleteOAuthClientResponse?.status === RESPONSE_STATUS.OK) {
            navigate('../oauth-clients', { replace: true });
        }
    }, [navigate, deleteOAuthClientResponse]);

    useEffect(() => {
        if (createOAuthClientResponse && !isNaN(createOAuthClientResponse.id)) {
            navigate(`../oauth-clients/${createOAuthClientResponse?.id}`, {
                replace: false,
                state: {
                    secret: createOAuthClientResponse.clientSecrets,
                },
            });
        }
    }, [navigate, createOAuthClientResponse]);

    return (
        <div className={styles.OauthClient} data-testid="oauth-client">
            {isLoading ? (
                <div>Loading</div>
            ) : (
                <div>
                    <div>{oauthClient?.id}</div>
                    <input
                        type="text"
                        className="form-control"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                    />
                    {isCrateMode ? (
                        <div>
                            <button
                                disabled={
                                    !clientId || clientId === '' || isCreating
                                }
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
                                    (state as OauthClientLocationState)?.secret
                                }
                                disabled
                            />
                            <button
                                disabled={isDeleting}
                                onClick={deleteMultipleApi}
                            >
                                {isDeleting ? 'Deleting' : 'Delete'}
                            </button>
                            <button disabled={isUpdating} onClick={updateApi}>
                                {isUpdating ? 'Updating' : 'Update'}
                            </button>
                            <button
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
    );
};

export default OauthClient;
