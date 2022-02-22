import styles from './oauth-client.module.scss';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/redux.hook';
import {
    useGetOauthClient,
    useRevokeSecretOauthClient,
} from '@/hooks/apis/oauth-clients.hook';
import { selectOauthClients } from '@/redux/reducers/oauth-clients.reducer';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useUpdateOauthClient,
    useDeleteOauthClients,
} from '@/hooks/apis/oauth-clients.hook';
import { RESPONSE_STATUS } from '@/constants/api';

const OauthClient = () => {
    const { id } = useParams();
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

    useEffect(() => {
        if (oauthClient) {
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

    return (
        <div className={styles.OauthClient} data-testid="oauth-client">
            {isLoading || list === null ? (
                <div>Loading</div>
            ) : (
                <div>
                    <div>{oauthClient.id}</div>
                    <input
                        type="text"
                        className="form-control"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                    />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="****************************"
                        value={revokeSecretResponse?.secret}
                        disabled
                    />
                    <button disabled={isDeleting} onClick={deleteMultipleApi}>
                        {isDeleting ? 'Deleting' : 'Delete'}
                    </button>
                    <button disabled={isUpdating} onClick={updateApi}>
                        {isUpdating ? 'Updating' : 'Update'}
                    </button>
                    <button disabled={isRevoking} onClick={revokeSecretApi}>
                        {isRevoking ? 'Revoking' : 'Revoke Client Secret'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default OauthClient;
