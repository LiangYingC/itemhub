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
import refreshIcon from '/src/assets/images/refresh.svg';
import lightTrashIcon from '@/assets/images/light-trash.svg';
import { useDispatch } from 'react-redux';
import { toasterActions, ToasterType } from '@/redux/reducers/toaster.reducer';

interface OauthClientLocationState {
    secret: string;
}

const OauthClient = () => {
    const { id: idFromUrl } = useParams();
    const { state } = useLocation();
    const id: number | null = idFromUrl ? Number(idFromUrl) : null;
    const isCreateMode = id === null;

    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        fetchApi: deleteApi,
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
            dispatch(
                toasterActions.push({
                    message: 'oAuthClient 已經成功刪除',
                    duration: 5,
                    type: ToasterType.INFO,
                })
            );
            navigate('/dashboard/oauth-clients', { replace: true });
        }
    }, [deleteOAuthClientResponse]);

    useEffect(() => {
        if (createOAuthClientResponse && !isNaN(createOAuthClientResponse.id)) {
            dispatch(
                toasterActions.push({
                    message: '新增 oAuthClient 成功',
                    duration: 5,
                    type: ToasterType.INFO,
                })
            );
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
    }, [createOAuthClientResponse]);

    const backToList = () => {
        navigate('/dashboard/oauth-clients');
    };

    const deleteClient = () => {
        if (prompt('確認刪除 oAuthClient? 請輸入 delete') !== 'delete') {
            alert('輸入錯誤');
            return;
        }
        deleteApi();
    };

    return (
        <div className="oauth-client" data-testid="oauth-client">
            <PageTitle
                titleClickCallback={backToList}
                titleBackIconVisible
                title={`oAuthClient 詳細內容`}
                primaryButtonVisible={!isCreateMode}
                primaryButtonWording="刪除選取"
                primaryButtonCallback={deleteClient}
                primaryButtonIcon={lightTrashIcon}
                primaryButtonClassName="bg-danger text-white border border-danger"
            />
            <div className="mt-3">
                <div className="card mx-4 p-45">
                    {isGetting ? (
                        <div>Loading</div>
                    ) : (
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="mb-2">Client Id</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={clientId}
                                    placeholder="如果不填寫 clientId 系統會自動會幫你隨機產生"
                                    onChange={(e) =>
                                        setClientId(e.target.value)
                                    }
                                    disabled={!isCreateMode}
                                />
                            </div>
                            <div>
                                <label className="mb-2">Client Secret</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={
                                        isCreateMode
                                            ? ''
                                            : '****************************'
                                    }
                                    value={
                                        revokeSecretResponse?.secret ||
                                        (state as OauthClientLocationState)
                                            ?.secret
                                    }
                                    disabled
                                />
                            </div>
                            <div className="text-warn mt-3 d-flex">
                                <div className="bg-warn rounded-circle text-white me-2 flex-shrink-0 mt-1">
                                    !
                                </div>
                                <div>
                                    請立即記下 Client Secret, 為確保安全性,
                                    伺服器端部會儲存 Secret 明碼, 如果忘記明碼,
                                    只能重新產生 Secret
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-5">
                                <button
                                    className="btn rounded-pill bg-black bg-opacity-5 border-black border-opacity-10 px-3 py-2"
                                    onClick={backToList}
                                >
                                    返回
                                </button>
                                {isCreateMode ? (
                                    <button
                                        className="btn rounded-pill bg-primary-500 text-white ms-3 px-3 py-2"
                                        disabled={isCreating}
                                        onClick={createApi}
                                    >
                                        確定新增
                                    </button>
                                ) : (
                                    <div>
                                        <button
                                            className="btn rounded-pill bg-primary-500 text-white px-3 py-2 ms-3"
                                            disabled={isRevoking}
                                            onClick={revokeSecretApi}
                                        >
                                            <img
                                                className="me-2"
                                                src={refreshIcon}
                                            />
                                            {isRevoking
                                                ? 'Revoking'
                                                : 'Revoke Client Secret'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OauthClient;
