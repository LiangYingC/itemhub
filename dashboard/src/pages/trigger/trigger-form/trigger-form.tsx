import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux.hook';
import { useGetAllDevicesApi } from '@/hooks/apis/devices.hook';
import { useGetDevicePinsApi } from '@/hooks/apis/device.pin.hook';
import {
    useCreateTriggerApi,
    useUpdateTriggerApi,
} from '@/hooks/apis/triggers.hook';
import DeviceAndPinInputs from '@/components/inputs/device-and-pin-input/device-and-pin-input';
import Breadcrumbs from '@/components/breadcrumbs/breadcrumbs';
import { selectUniversal } from '@/redux/reducers/universal.reducer';
import { TriggerItem } from '@/types/triggers.type';
import leftArrowIcon from '@/assets/images/left-arrow.svg';

const TriggerForm = ({
    trigger,
    isCreateMode,
}: {
    trigger: TriggerItem | null;
    isCreateMode: boolean;
}) => {
    const navigate = useNavigate();

    const { triggerOperators } = useAppSelector(selectUniversal);

    const [editedTriggerData, setEditedTriggerData] = useState({
        sourceDeviceId: trigger?.sourceDeviceId || 0,
        sourcePin: trigger?.sourcePin || '',
        sourceThreshold: trigger?.sourceThreshold || '',
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
        editedTriggerData.sourceDeviceId === 0 ? [] : saurceDeviecePins;
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
            : destinationDeviecePins;
    useEffect(() => {
        if (editedTriggerData.destinationDeviceId) {
            getDestinationDevicePinsApi();
        }
    }, [editedTriggerData.destinationDeviceId, getDestinationDevicePinsApi]);

    const { isCreatingTrigger, createTriggerResponse, createTriggerApi } =
        useCreateTriggerApi({
            ...editedTriggerData,
            sourceThreshold: Number(editedTriggerData.sourceThreshold),
        });
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
        updatedData: {
            ...editedTriggerData,
            sourceThreshold: Number(editedTriggerData.sourceThreshold),
        },
    });

    // TODO: 可改用 pagination api，用 name query 去讓 sever 就篩選好我們要的 options，不用在 client 端 filter
    const { allDevices, getAllDevicesApi } = useGetAllDevicesApi();
    useEffect(() => {
        getAllDevicesApi();
    }, []);

    const breadcrumbs = [
        {
            label: '觸發列表',
            pathName: '/dashboard/triggers',
        },
        {
            label: isCreateMode ? '新增' : '編輯',
            pathName: useLocation().pathname,
        },
    ];

    return (
        <div className="trigger-form-wrapper px-3 px-lg-0 mx-auto mt-4 mt-lg-4">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <h3
                className="title d-flex align-item-center mb-3 mb-lg-4"
                onClick={() => navigate('/dashboard/triggers')}
            >
                <img className="me-2 me-lg-3" src={leftArrowIcon} alt="Back" />
                {isCreateMode ? '新增觸發' : '編輯觸發'}
            </h3>
            <form className="card m-0">
                <div className="mb-3">
                    <label className="form-label" htmlFor="trigger-name">
                        觸發名稱
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="trigger-name"
                        placeholder="輸入名稱"
                        value={trigger?.name}
                        onChange={(e) => {
                            setEditedTriggerData((prev) => {
                                return {
                                    ...prev,
                                    name: e.target.value,
                                };
                            });
                        }}
                    />
                </div>
                <DeviceAndPinInputs
                    allDevices={allDevices}
                    initialDeviceName={trigger?.sourceDevice?.name || ''}
                    deviceNameLabel="來源裝置"
                    pinLabel="來源裝置 Pin"
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
                <div className="w-100 d-flex flex-column flex-md-row">
                    <div className="form-group w-100 mb-3 pe-md-3">
                        <label className="mb-1">運算子</label>
                        <select
                            className="form-select"
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
                                ({ key, value, label, symbol }) => {
                                    return (
                                        <option key={key} value={value}>
                                            {symbol || label}
                                        </option>
                                    );
                                }
                            )}
                        </select>
                    </div>
                    <div className="form-group w-100 mb-3 ps-md-3">
                        <label className="mb-1">來源裝置門檻</label>
                        <input
                            className="form-control"
                            type="text"
                            placeholder="設定裝置條件"
                            value={editedTriggerData.sourceThreshold}
                            onChange={(e) => {
                                setEditedTriggerData((prev) => {
                                    return {
                                        ...prev,
                                        sourceThreshold: e.target.value,
                                    };
                                });
                            }}
                        />
                    </div>
                </div>
                <DeviceAndPinInputs
                    allDevices={allDevices}
                    initialDeviceName={trigger?.destinationDevice?.name || ''}
                    deviceNameLabel="目標裝置"
                    pinLabel="目標裝置 Pin"
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
                <div className="row">
                    <label className="col-6">
                        <div className="mb-1">目標狀態</div>
                        <select
                            className="form-select"
                            value={
                                editedTriggerData.destinationDeviceTargetState
                            }
                            onChange={(e) => {
                                setEditedTriggerData((prev) => {
                                    return {
                                        ...prev,
                                        destinationDeviceTargetState: parseInt(
                                            e.target.value
                                        ),
                                    };
                                });
                            }}
                        >
                            <option value="1">開</option>
                            <option value="0">關</option>
                        </select>
                    </label>
                </div>
                <div className="d-flex justify-content-end">
                    <button
                        type="button"
                        className="btn btn-secondary mt-3 me-3"
                        onClick={() => navigate('/dashboard/triggers')}
                        disabled={isCreatingTrigger}
                    >
                        返回
                    </button>
                    {isCreateMode ? (
                        <button
                            type="submit"
                            className="btn btn-primary mt-3"
                            onClick={createTriggerApi}
                            disabled={isCreatingTrigger}
                        >
                            {isCreatingTrigger ? '新增中' : '確定新增'}
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn btn-primary mt-3"
                            onClick={updateTriggerApi}
                            disabled={isUpdatingTrigger}
                        >
                            {isUpdatingTrigger ? '儲存中' : '儲存編輯'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TriggerForm;
