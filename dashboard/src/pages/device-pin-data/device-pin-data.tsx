import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import {
    useCreateDeviceApi,
    useGetDeviceApi,
    useUpdateDeviceApi,
} from '@/hooks/apis/devices.hook';
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
import arduinoNano33Iot from '@/assets/images/arduino-nano-33-iot.svg';
import particleIoPhoton from '@/assets/images/particle-io-photon.jpeg';
import esp01s from '@/assets/images/esp-01s.svg';
import { selectUniversal } from '@/redux/reducers/universal.reducer';
import refreshPrimaryIcon from '@/assets/images/refresh-primary.svg';
import {
    useCreateOauthClients,
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
    const isCreateMode = id === null;

    const devices = useAppSelector(selectDevices).devices;
    const oAuthClients = useAppSelector(selectOauthClients).oauthClients;

    const device =
        (devices || []).filter((device) => device.id === Number(id))[0] || null;

    const [name, setName] = useState('');
    const [microcontroller, setMicrocontroller] = useState(0);

    const oAuthClient =
        (oAuthClients || []).filter(
            (client) => client.deviceId === device?.id
        )[0] || null;

    const { isLoading: isGetting, fetchApi: getDeviceApi } = useGetDeviceApi(
        Number(id)
    );

    const { error: getOauthClientError, fetchApi: getOauthClientByDeviceId } =
        useGetOauthClientByDeviceId(Number(id));

    const { microcontrollers } = useAppSelector(selectUniversal);
    const oAuthId = oAuthClient ? oAuthClient.id : '';
    const oAuthClientId = oAuthClient ? oAuthClient.clientId : '';
    const [clientId, setClientId] = useState(oAuthClientId);
    const [microcontrollerImg, setMicrocontrollerImg] =
        useState(particleIoPhoton);

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
            name: name ? name : device?.name,
            microcontroller: microcontroller
                ? Number(microcontroller)
                : device?.microcontroller,
        },
    });

    const {
        fetchApi: createSecretApi,
        isLoading: isCreatSecreting,
        data: createOAuthClientResponse,
    } = useCreateOauthClients(clientId, Number(id));

    const {
        fetchApi: createDeviceApi,
        isLoading: isCreating,
        data: createDeviceResponse,
    } = useCreateDeviceApi(name, microcontroller);

    const back = () => {
        if (isCreateMode) {
            navigate(`/dashboard/devices/`);
            return;
        }
        navigate(`/dashboard/devices/${id}`);
    };

    useEffect(() => {
        if (isCreateMode) {
            return;
        }
        getDeviceApi();
    }, []);

    useEffect(() => {
        setName(name);
        setMicrocontroller(microcontroller);
        if (device !== null) {
            setMicrocontroller(Number(device.microcontroller));
        }
        if (device !== null && oAuthClient === null && !isCreateMode) {
            getOauthClientByDeviceId();
        }
    }, [device]);

    useEffect(() => {
        setClientId(clientId);
    }, [oAuthClient]);

    useEffect(() => {
        if (getOauthClientError?.errorKey === 'DATA_NOT_FOUND') {
            createSecretApi();
        }
    }, [getOauthClientError]);

    useEffect(() => {
        const microcontrollerKey = microcontrollers.filter((item) => {
            return item.id === microcontroller;
        });
        if (!microcontrollerKey || microcontrollerKey.length === 0) {
            return;
        }
        if (microcontrollerKey[0].key === 'PARTICLE_IO_PHOTON') {
            setMicrocontrollerImg(particleIoPhoton);
        }
        if (microcontrollerKey[0].key === 'ARDUINO_NANO_IOT_33') {
            setMicrocontrollerImg(arduinoNano33Iot);
        }
        if (microcontrollerKey[0].key === 'ESP_01S') {
            setMicrocontrollerImg(esp01s);
        }
    }, [microcontroller]);

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

    useEffect(() => {
        if (createOAuthClientResponse && !isNaN(createOAuthClientResponse.id)) {
            dispatch(
                toasterActions.pushOne({
                    message: '新增 oAuthClient 成功',
                    duration: 5,
                    type: ToasterTypeEnum.INFO,
                })
            );
            setClientId(createOAuthClientResponse.clientId);
            setRevokeSecret(createOAuthClientResponse.clientSecrets);
        }
    }, [createOAuthClientResponse]);

    useEffect(() => {
        if (createDeviceResponse && !isNaN(createDeviceResponse.id)) {
            dispatch(
                toasterActions.pushOne({
                    message: '新增 Device 成功',
                    duration: 5,
                    type: ToasterTypeEnum.INFO,
                })
            );
            navigate(`/dashboard/devices/${createDeviceResponse.id}/edit`);
        }
    }, [createDeviceResponse]);

    return (
        // UI 結構等設計稿後再重構調整
        <div className="device-pin-data" data-testid="device-pin-data">
            <PageTitle
                titleClickCallback={back}
                titleBackIconVisible
                title={isCreateMode ? '新增裝置' : '編輯裝置'}
            />
            {isGetting ? (
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
                                defaultValue={device ? device.name : ''}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label>裝置類型</label>
                            <select
                                defaultValue={
                                    device ? device.microcontroller : 0
                                }
                                onChange={(e) =>
                                    setMicrocontroller(Number(e.target.value))
                                }
                                className="form-select"
                            >
                                {microcontrollers.map(({ id, key }) => {
                                    return (
                                        <option key={id} value={id}>
                                            {key
                                                .replaceAll('_', ' ')
                                                .toLowerCase()}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label>選擇 Pin</label>
                            <div className="d-flex mt-4">
                                <div className="position-relative pin me-3">
                                    <div className="text-success text-center pb-1 pin-selector">
                                        感應器
                                    </div>
                                    <div
                                        className="pin-text mt-25"
                                        role="button"
                                    >
                                        D10
                                    </div>
                                    <div className="pin-option">
                                        <div
                                            className="lh-1 p-25"
                                            role="button"
                                        >
                                            開關
                                        </div>
                                        <div
                                            className="lh-1 p-25"
                                            role="button"
                                        >
                                            感應器
                                        </div>
                                        <div
                                            className="lh-1 p-25"
                                            role="button"
                                        >
                                            取消
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-4 text-center">
                            <img
                                className="w-100 microcontroller-img"
                                src={microcontrollerImg}
                                alt=""
                            />
                        </div>
                        {isCreateMode ? (
                            <div />
                        ) : (
                            <div className="row">
                                <div className="col-12 col-lg-6 p-0">
                                    <label>Client Id</label>
                                    <input
                                        type="text"
                                        className="form-control mt-2"
                                        placeholder="如果不填寫 clientId 系統會自動會幫你隨機產生"
                                        value={
                                            oAuthClient
                                                ? oAuthClient.clientId
                                                : ''
                                        }
                                        disabled={!isCreateMode}
                                    />
                                </div>
                                <div className="col-12 col-lg-6 ps-3 pe-0">
                                    <label>Client Secret</label>
                                    <div>
                                        <input
                                            type="text"
                                            className="form-control mt-2"
                                            placeholder="****************************"
                                            value={
                                                revokeSecretResponse?.secret ||
                                                (
                                                    state as OauthClientLocationState
                                                )?.secret ||
                                                createOAuthClientResponse?.clientSecrets
                                            }
                                            disabled
                                        />
                                        <div
                                            className="d-flex pt-1"
                                            onClick={revokeSecretApi}
                                            role="button"
                                        >
                                            <div className="text-primary">
                                                重新產生 Client Secret
                                            </div>
                                            <div className="ps-2">
                                                <img
                                                    src={refreshPrimaryIcon}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-warn d-flex pt-1 ">
                                        <div className="bg-warn text-white rounded-circle icon-warm me-1 flex-shrink-0">
                                            !
                                        </div>
                                        <div>
                                            請立即記下 Client
                                            Secret，為保持安全性，再次查看需重新產生並打包燒錄程式碼
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="d-flex justify-content-end mt-5">
                            <button
                                className="btn btn-secondary me-3"
                                onClick={back}
                            >
                                返回
                            </button>
                            {isCreateMode ? (
                                <button
                                    disabled={isCreating}
                                    className="btn btn-primary"
                                    onClick={createDeviceApi}
                                >
                                    新增
                                </button>
                            ) : (
                                <button
                                    disabled={
                                        isRevoking ||
                                        isUpdating ||
                                        !revokeSecretResponse
                                    }
                                    className="btn btn-primary"
                                    onClick={updateDeviceApi}
                                >
                                    儲存編輯
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Device;
