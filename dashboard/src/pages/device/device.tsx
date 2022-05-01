import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    useDeleteDevicesApi,
    useGetDeviceApi,
    useUpdateDeviceApi,
} from '@/hooks/apis/devices.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import { selectDevices } from '@/redux/reducers/devices.reducer';
import Pins from '@/components/pins/pins';
import { RESPONSE_STATUS } from '@/constants/api';
import PageTitle from '@/components/page-title/page-title';
import { useGetOauthClientByDeviceId } from '@/hooks/apis/oauth-clients.hook';
import { selectOauthClients } from '@/redux/reducers/oauth-clients.reducer';
import { useDispatch } from 'react-redux';
import { dialogActions, DialogTypeEnum } from '@/redux/reducers/dialog.reducer';

const Device = () => {
    const { id } = useParams();
    const numId = Number(id);
    const devices = useAppSelector(selectDevices).devices;
    const oAuthClients = useAppSelector(selectOauthClients).oauthClients;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const device =
        (devices || []).filter((device) => device.id === numId)[0] || null;

    const oAuthClient =
        oAuthClients?.filter((client) => client.deviceId === device?.id)[0] ||
        null;

    const [deviceName, setDeviceName] = useState<string>('');

    const { isLoading, getDeviceApi } = useGetDeviceApi({
        id: numId,
    });

    const {
        isLoading: isOauthClientLoading,
        fetchApi: getOauthClientByDeviceId,
    } = useGetOauthClientByDeviceId(device ? device.id : 0);

    const { updateDeviceApi, isLoading: isUpdating } = useUpdateDeviceApi({
        id: numId,
        editedData: {
            name: deviceName,
            deviceId: device?.deviceId,
        },
    });

    const {
        fetchApi: deleteMultipleApi,
        isLoading: isDeleting,
        data: deleteDeviceResponse,
    } = useDeleteDevicesApi([numId]);

    const deleteDevice = () => {
        dispatch(
            dialogActions.open({
                message: `刪除後將無法復原, 請輸入 DELETE 完成刪除 ${deviceName}`,
                title: '確認刪除裝置 ?',
                type: DialogTypeEnum.PROMPT,
                checkedMessage: 'DELETE',
                callback: deleteMultipleApi,
                promptInvalidMessage: '輸入錯誤',
            })
        );
    };

    useEffect(() => {
        if (device === null) {
            getDeviceApi();
        }
    }, []);

    useEffect(() => {
        if (device === null) {
            return;
        }
        if (oAuthClient === null) {
            getOauthClientByDeviceId();
        }
    }, [device]);

    useEffect(() => {
        setDeviceName(device ? device.name : '');
    }, [device]);

    useEffect(() => {
        if (deleteDeviceResponse?.status === RESPONSE_STATUS.OK) {
            navigate('../devices', { replace: true });
        }
    }, [navigate, deleteDeviceResponse]);

    return (
        // UI 結構等設計稿後再重構調整
        <div className="device" data-testid="device">
            <PageTitle title={`裝置 - ${deviceName}`} />
            {isLoading || device === null ? (
                <div>Loading</div>
            ) : (
                <div>
                    <div className="mb-4">
                        <div className="form-group mt-3">
                            <label>裝置名稱</label>
                            <input
                                className="form-control"
                                value={deviceName}
                                onChange={(e) => setDeviceName(e.target.value)}
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label>裝置 ID</label>
                            <input
                                className="form-control"
                                disabled
                                value={device.deviceId}
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label>建立時間</label>
                            <input
                                className="form-control"
                                disabled
                                value={device.createdAt}
                            />
                        </div>

                        <div className="form-group mt-3">
                            <label>狀態</label>
                            <input
                                className="form-control"
                                disabled
                                value={device.online ? '開' : '關'}
                            />
                        </div>

                        <button
                            className="btn border mt-3"
                            onClick={updateDeviceApi}
                            disabled={isUpdating}
                        >
                            {isUpdating ? '更新中' : '更新'}
                        </button>

                        <button
                            className="btn border mt-3 ms-3"
                            onClick={deleteDevice}
                            disabled={isDeleting}
                        >
                            {isUpdating ? '刪除中' : '刪除'}
                        </button>
                    </div>
                    <div>
                        <h2>Pins Data</h2>
                        <Pins deviceId={Number(id)} isEditMode />
                    </div>
                </div>
            )}

            {isOauthClientLoading ? (
                <div>Loading</div>
            ) : (
                <>
                    <div>
                        <label>ClientId: </label>
                        <input
                            className="form-control"
                            value={oAuthClient?.clientId}
                        />
                    </div>
                    <div>
                        <label>Secret: </label>
                        <div className="form-control">
                            {oAuthClient?.clientSecrets || '*****'}
                        </div>
                    </div>
                </>
            )}
            <div>
                <Link to="../dashboard/devices">Back to device list</Link>
            </div>
        </div>
    );
};

export default Device;
