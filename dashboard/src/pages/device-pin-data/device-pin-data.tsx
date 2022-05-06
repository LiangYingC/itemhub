import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { useGetDeviceApi, useUpdateDeviceApi } from '@/hooks/apis/devices.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import { selectDevices } from '@/redux/reducers/devices.reducer';
import Pins from '@/components/pins/pins';
import { RESPONSE_STATUS } from '@/constants/api';
import PageTitle from '@/components/page-title/page-title';
import { useDispatch } from 'react-redux';
import { dialogActions, DialogTypeEnum } from '@/redux/reducers/dialog.reducer';
import {
    toasterActions,
    ToasterTypeEnum,
} from '@/redux/reducers/toaster.reducer';
// import moment from 'moment';
import semiconductor from '@/assets/images/semiconductor.svg';
import { selectUniversal } from '@/redux/reducers/universal.reducer';
import refreshPrimaryIcon from '@/assets/images/refresh-primary.svg';
import {
    useGetOauthClientByDeviceId,
    useRevokeSecretOauthClient,
} from '@/hooks/apis/oauth-clients.hook';
import { selectOauthClients } from '@/redux/reducers/oauth-clients.reducer';
interface OauthClientLocationState {
    secret: string;
}

const Device = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { id: idFromUrl, pin } = useParams();
    const { state } = useLocation();
    const id: number | null = idFromUrl ? Number(idFromUrl) : null;

    const devices = useAppSelector(selectDevices).devices;
    const oAuthClients = useAppSelector(selectOauthClients).oauthClients;

    const device =
        (devices || []).filter((device) => device.id === Number(id))[0] || null;

    const deviceName = device ? device.name : '';
    const deviceMicrocontroller = device ? device.microcontroller : '';
    const [name, setName] = useState('');
    const [microcontroller, setMicrocontroller] = useState('');

    const oAuthClient =
        (oAuthClients || []).filter(
            (client) => client.deviceId === device?.id
        )[0] || null;

    const { isLoading: isGetting, fetchApi: getDeviceApi } = useGetDeviceApi(
        Number(id)
    );

    const { fetchApi: getOauthClientByDeviceId } = useGetOauthClientByDeviceId(
        Number(id)
    );

    const { firmwareTypes } = useAppSelector(selectUniversal);
    const oAuthId = oAuthClient ? oAuthClient.id : '';
    const oAuthClientId = oAuthClient ? oAuthClient.clientId : '';
    const [clientId, setClientId] = useState(oAuthClientId);

    const {
        fetchApi: revokeSecretApi,
        isLoading: isRevoking,
        data: revokeSecretResponse,
    } = useRevokeSecretOauthClient(Number(oAuthId));

    const revokeSecretData =
        revokeSecretResponse?.secret ||
        (state as OauthClientLocationState)?.secret;

    const [revokeSecret, setRevokeSecret] = useState(revokeSecretData);

    const {
        isLoading: isUpdating,
        updateDeviceApi,
        data: updateDeviceResponse,
    } = useUpdateDeviceApi({
        id: Number(id),
        editedData: {
            name: name ? name : device.name,
            microcontroller: microcontroller
                ? Number(microcontroller)
                : device.microcontroller,
        },
    });

    const backToDetail = () => {
        navigate(`/dashboard/devices/${id}`);
    };

    useEffect(() => {
        if (device === null) {
            getDeviceApi();
            return;
        }
        if (oAuthClient === null) {
            getOauthClientByDeviceId();
        }
    }, [device]);

    useEffect(() => {
        setName(name);
    }, [device]);

    useEffect(() => {
        setClientId(clientId);
    }, [oAuthClient]);

    useEffect(() => {
        setMicrocontroller(microcontroller);
    }, [device]);

    useEffect(() => {
        setRevokeSecret(revokeSecret);
    }, [revokeSecretData]);

    useEffect(() => {
        if (updateDeviceResponse?.status === RESPONSE_STATUS.OK) {
            dispatch(
                toasterActions.pushOne({
                    message:
                        '裝置編輯已儲存，請重新打包程式碼並燒錄至裝置內以正常運作',
                    duration: 10,
                    type: ToasterTypeEnum.INFO,
                })
            );
            navigate(`/dashboard/devices/${id}`);
        }
    }, [updateDeviceResponse]);

    return (
        // UI 結構等設計稿後再重構調整
        <div className="device-pin-data" data-testid="device-pin-data">
            <PageTitle
                titleClickCallback={backToDetail}
                titleBackIconVisible
                title="編輯裝置"
            />
            {isGetting || device === null || oAuthClient === null ? (
                <div>Loading</div>
            ) : (
                <div className="card">
                    <div className="p-4">
                        <div className="mb-4">
                            <label>裝置名稱</label>
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="請輸入裝置名稱"
                                defaultValue={device.name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label>裝置類型</label>
                            <select
                                defaultValue={device.microcontroller}
                                onChange={(e) =>
                                    setMicrocontroller(e.target.value)
                                }
                                className="form-select"
                            >
                                {firmwareTypes.map(({ key, value, label }) => {
                                    return (
                                        <option key={key} value={value}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mb-4 text-center">
                            <img src={semiconductor} alt="" />
                        </div>
                        <div className="row">
                            <div className="col-12 col-lg-6 p-0">
                                <label>Client Id</label>
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    value={oAuthClient.clientId}
                                    disabled
                                />
                            </div>
                            <div className="col-12 col-lg-6 ps-3 pe-0">
                                <label>Client Secret</label>
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    placeholder="****************************"
                                    value={
                                        revokeSecretResponse?.secret ||
                                        (state as OauthClientLocationState)
                                            ?.secret
                                    }
                                    disabled
                                />
                                <div
                                    className="d-flex pt-1"
                                    onClick={revokeSecretApi}
                                    role="button"
                                >
                                    <div className="text-primary">
                                        Revoke Client Secret
                                    </div>
                                    <div className="ps-2">
                                        <img src={refreshPrimaryIcon} alt="" />
                                    </div>
                                </div>
                                <div className="text-warn d-flex align-items-center pt-1 ">
                                    <div className="bg-warn text-white rounded-circle icon-warm me-1">
                                        !
                                    </div>
                                    <div>
                                        Revoke Client Secret
                                        需重新打包燒錄程式碼
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-5">
                            <button
                                className="btn btn-secondary me-3"
                                onClick={backToDetail}
                            >
                                返回
                            </button>
                            <button
                                disabled={isRevoking || isUpdating}
                                className="btn btn-primary"
                                onClick={updateDeviceApi}
                            >
                                儲存編輯
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Device;
