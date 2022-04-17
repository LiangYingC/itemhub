import styles from './trigger.module.scss';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.hook';
import {
    useGetTriggerApi,
    useUpdateTriggerApi,
} from '@/hooks/apis/triggers.hook';
import { useGetDevicePinsApi } from '@/hooks/apis/devices.hook';
import { useGetAllDevicesApi } from '@/hooks/apis/devices.hook';
import { selectTriggers } from '@/redux/reducers/triggers.reducer';
import { selectUniversal } from '@/redux/reducers/universal.reducer';
import DeviceAndPinInputs from '@/components/Inputs/deviceAndPinInput/deviceAndPinInput';

const Trigger = () => {
    const { id: idFromUrl } = useParams();
    const id = Number(idFromUrl);

    const { triggers } = useAppSelector(selectTriggers);
    const { triggerOperators } = useAppSelector(selectUniversal);

    const trigger = triggers?.filter((trigger) => trigger.id === id)[0] || null;

    const [editedTriggerData, setEditedTriggerData] = useState({
        sourceDeviceId: trigger?.sourceDeviceId || 0,
        sourcePin: trigger?.sourcePin || '',
        sourceThreshold: trigger?.sourceThreshold || 0,
        destinationDeviceId: trigger?.destinationDeviceId || 0,
        destinationPin: trigger?.destinationPin || '',
        destinationDeviceTargetState:
            trigger?.destinationDeviceTargetState || 0,
        operator: trigger?.operator || 0,
    });

    console.log({ editedTriggerData });

    const {
        devicePins: saurceDeviecePins,
        getDevicePinsApi: getSourceDevicePinsApi,
    } = useGetDevicePinsApi({
        id: Number(editedTriggerData.sourceDeviceId),
    });
    useEffect(() => {
        if (editedTriggerData.sourceDeviceId) {
            getSourceDevicePinsApi();
        }
    }, [editedTriggerData.sourceDeviceId, getSourceDevicePinsApi]);

    const {
        devicePins: destinationDeviecePins,
        getDevicePinsApi: getDestinationDevicePinsApi,
    } = useGetDevicePinsApi({
        id: Number(editedTriggerData.destinationDeviceId),
    });
    useEffect(() => {
        if (editedTriggerData.destinationDeviceId) {
            getDestinationDevicePinsApi();
        }
    }, [editedTriggerData.destinationDeviceId, getDestinationDevicePinsApi]);

    const { isGettingTrigger, getTriggerApi } = useGetTriggerApi(id || 0);
    useEffect(() => {
        if (trigger === null) {
            getTriggerApi();
        }
    }, [trigger, getTriggerApi]);

    const { isUpdatingTrigger, updateTriggerApi } = useUpdateTriggerApi({
        trigerId: trigger?.id || 0,
        updatedData: editedTriggerData,
    });

    const { allDevices, getAllDevicesApi } = useGetAllDevicesApi();
    useEffect(() => {
        getAllDevicesApi();
    }, []);

    return (
        <div className={styles.trigger} data-testid="trigger">
            {isGettingTrigger || trigger === null ? (
                <div>Loading</div>
            ) : (
                <>
                    <div className="mb-4">
                        <div className="form-group mt-3">
                            <label>建立時間</label>
                            <input
                                className="form-control"
                                disabled
                                defaultValue={trigger.createdAt}
                            />
                        </div>
                        <DeviceAndPinInputs
                            allDevices={allDevices}
                            initialDeviceName={trigger.sourceDevice?.name || ''}
                            deviceIdLable="來源裝置 ID"
                            deviceIdValue={editedTriggerData.sourceDeviceId}
                            deviceNameLabel="來源裝置名稱"
                            pinLabel="來源裝置 PIN"
                            pinValue={editedTriggerData.sourcePin}
                            pinOptions={saurceDeviecePins || []}
                            updatePin={(newPin) =>
                                setEditedTriggerData((prev) => {
                                    return {
                                        ...prev,
                                        sourcePin: newPin,
                                    };
                                })
                            }
                            updateDeviceId={(newDeviceId) =>
                                setEditedTriggerData((prev) => {
                                    return {
                                        ...prev,
                                        sourceDeviceId: newDeviceId,
                                    };
                                })
                            }
                        />
                        <DeviceAndPinInputs
                            allDevices={allDevices}
                            initialDeviceName={
                                trigger.destinationDevice?.name || ''
                            }
                            deviceIdLable="目標裝置 ID"
                            deviceIdValue={
                                editedTriggerData.destinationDeviceId
                            }
                            deviceNameLabel="目標裝置名稱"
                            pinLabel="目標裝置 PIN"
                            pinValue={editedTriggerData.destinationPin}
                            pinOptions={destinationDeviecePins || []}
                            updatePin={(newPin) =>
                                setEditedTriggerData((prev) => {
                                    return {
                                        ...prev,
                                        destinationPin: newPin,
                                    };
                                })
                            }
                            updateDeviceId={(newDeviceId) =>
                                setEditedTriggerData((prev) => {
                                    return {
                                        ...prev,
                                        destinationDeviceId: newDeviceId,
                                    };
                                })
                            }
                        />
                        <div className="form-group mt-3">
                            <label>運算子</label>
                            <select
                                value={editedTriggerData.operator}
                                onChange={(e) => {
                                    setEditedTriggerData((prev) => {
                                        return {
                                            ...prev,
                                            operator: Number(e.target.value),
                                        };
                                    });
                                }}
                            >
                                {triggerOperators.map(
                                    ({ key, value, label }) => {
                                        return (
                                            <option key={key} value={value}>
                                                {label}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        </div>
                        <div className="form-group mt-3">
                            <label>門檻</label>
                            <input
                                className="form-control"
                                type="number"
                                value={editedTriggerData.sourceThreshold}
                                onChange={(e) =>
                                    setEditedTriggerData((prev) => {
                                        return {
                                            ...prev,
                                            sourceThreshold: Number(
                                                e.target.value
                                            ),
                                        };
                                    })
                                }
                            />
                        </div>
                        <button
                            className="btn border mt-3"
                            onClick={updateTriggerApi}
                            disabled={isUpdatingTrigger}
                        >
                            {isUpdatingTrigger ? '更新中' : '更新'}
                        </button>
                    </div>
                    <Link to="../triggers">Back to triggers</Link>
                </>
            )}
        </div>
    );
};

export default Trigger;
