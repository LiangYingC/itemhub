import styles from './device.module.scss';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetDeviceApi, useUpdateDeviceApi } from '@/hooks/apis/devices.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import { selectDevices } from '@/redux/reducers/devices.reducer';
import Pins from '@/components/pins/pins';

const Device = () => {
    const { id } = useParams();
    const numId = Number(id);
    const devices = useAppSelector(selectDevices);
    const device = devices?.filter((device) => device.id === numId)[0] || null;

    const [deviceName, setDeviceName] = useState<string>('');

    const { isLoading, getDeviceApi } = useGetDeviceApi({
        id: numId,
    });
    const { updateDeviceApi, isLoading: isUpdating } = useUpdateDeviceApi({
        id: numId,
        editedData: {
            name: deviceName,
            deviceId: device?.deviceId,
        },
    });

    useEffect(() => {
        if (device === null) {
            getDeviceApi();
        }
    }, []);

    useEffect(() => {
        setDeviceName(device ? device.name : '');
    }, [device]);

    return (
        // UI 結構等設計稿後再重構調整
        <div className={styles.device} data-testid="device">
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
                    </div>
                    <div>
                        <h2>Pins Data</h2>
                        <Pins deviceId={Number(id)} isEditMode />
                    </div>
                </div>
            )}
            <div>
                <Link to="../devices">Back to device list</Link>
            </div>
        </div>
    );
};

export default Device;
