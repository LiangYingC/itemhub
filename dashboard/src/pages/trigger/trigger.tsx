import styles from './trigger.module.scss';
import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.hook';
import {
    useGetTriggerApi,
    useCreateTriggerApi,
    useUpdateTriggerApi,
} from '@/hooks/apis/triggers.hook';
import { useGetDevicePinsApi } from '@/hooks/apis/devices.hook';
import { useGetAllDevicesApi } from '@/hooks/apis/devices.hook';
import { selectTriggers } from '@/redux/reducers/triggers.reducer';
import { selectUniversal } from '@/redux/reducers/universal.reducer';
import { TriggerItem } from '@/types/triggers.type';
import DeviceAndPinInputs from '@/components/Inputs/deviceAndPinInput/deviceAndPinInput';
import PageTitle from '@/components/page-title/page-title';

const Trigger = () => {
    const { id: idFromUrl } = useParams();
    const id = idFromUrl ? parseInt(idFromUrl) : null;
    const isCreateMode = id === null;
    const createLocationState = useLocation().state as {
        trigger: TriggerItem;
    } | null;

    const { triggers } = useAppSelector(selectTriggers);
    const { triggerOperators } = useAppSelector(selectUniversal);

    const trigger =
        triggers?.filter((trigger) => trigger.id === id)[0] ||
        createLocationState?.trigger ||
        null;

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

    const {
        devicePins: saurceDeviecePins,
        getDevicePinsApi: getSourceDevicePinsApi,
    } = useGetDevicePinsApi({
        id: editedTriggerData.sourceDeviceId,
    });
    const sourceDeviecePinsOptions =
        editedTriggerData.sourceDeviceId === 0 ? [] : saurceDeviecePins || [];
    useEffect(() => {
        if (editedTriggerData.sourceDeviceId) {
            getSourceDevicePinsApi();
        }
    }, [editedTriggerData.sourceDeviceId, getSourceDevicePinsApi]);

    const {
        devicePins: destinationDeviecePins,
        getDevicePinsApi: getDestinationDevicePinsApi,
    } = useGetDevicePinsApi({
        id: editedTriggerData.destinationDeviceId,
    });
    const destinationDeviecePinsOptions =
        editedTriggerData.destinationDeviceId === 0
            ? []
            : destinationDeviecePins || [];
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

    const navigate = useNavigate();
    const { isCreatingTrigger, createTriggerResponse, createTriggerApi } =
        useCreateTriggerApi(editedTriggerData);
    useEffect(() => {
        if (createTriggerResponse && createTriggerResponse.id) {
            navigate(`/dashboard/triggers/${createTriggerResponse.id}`, {
                replace: false,
                state: {
                    trigger: createTriggerResponse,
                },
            });
        }
    }, [navigate, createTriggerResponse]);

    const { isUpdatingTrigger, updateTriggerApi } = useUpdateTriggerApi({
        trigerId: trigger?.id || 0,
        updatedData: editedTriggerData,
    });

    // TODO: 可改用 pagination api，用 name query 去讓 sever 就篩選好我們要的 options，不用在 client 端 filter
    const { allDevices, getAllDevicesApi } = useGetAllDevicesApi();
    useEffect(() => {
        getAllDevicesApi();
    }, []);

    return (
        <div className="trigger" data-testid="trigger">
            <PageTitle title={`觸發 - `} /> {/* Todo: Trigger 加上 Name Field*/}
            {isGettingTrigger ? (
                <div>Loading</div>
            ) : (
                <>
                    <div className="mb-4">
                        {!isCreateMode && (
                            <div className="form-group mt-3">
                                <label>建立時間</label>
                                <input
                                    className="form-control"
                                    disabled
                                    defaultValue={trigger?.createdAt || ''}
                                />
                            </div>
                        )}
                        <DeviceAndPinInputs
                            allDevices={allDevices}
                            initialDeviceName={
                                trigger?.sourceDevice?.name || ''
                            }
                            deviceIdLable="來源裝置 ID"
                            deviceIdValue={editedTriggerData.sourceDeviceId}
                            deviceNameLabel="來源裝置名稱"
                            pinLabel="來源裝置 PIN"
                            pinValue={editedTriggerData.sourcePin}
                            pinOptions={sourceDeviecePinsOptions}
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
                                trigger?.destinationDevice?.name || ''
                            }
                            deviceIdLable="目標裝置 ID"
                            deviceIdValue={
                                editedTriggerData.destinationDeviceId
                            }
                            deviceNameLabel="目標裝置名稱"
                            pinLabel="目標裝置 PIN"
                            pinValue={editedTriggerData.destinationPin}
                            pinOptions={destinationDeviecePinsOptions}
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
                                            operator: parseInt(e.target.value),
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
                                            sourceThreshold: parseInt(
                                                e.target.value
                                            ),
                                        };
                                    })
                                }
                            />
                        </div>
                        {isCreateMode ? (
                            <button
                                className="btn border mt-3"
                                onClick={createTriggerApi}
                                disabled={isCreatingTrigger}
                            >
                                {isCreatingTrigger ? '新增中' : '新增'}
                            </button>
                        ) : (
                            <button
                                className="btn border mt-3"
                                onClick={updateTriggerApi}
                                disabled={isUpdatingTrigger}
                            >
                                {isUpdatingTrigger ? '更新中' : '更新'}
                            </button>
                        )}
                    </div>
                    <Link to="../dashboard/triggers">回到觸發裝置列表頁</Link>
                </>
            )}
        </div>
    );
};

export default Trigger;
