import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    useCreateDeviceApi,
    useGetDeviceApi,
    useUpdateDeviceApi,
} from '@/hooks/apis/devices.hook';
import {
    useCreatePinsApi,
    useDeletePinsApi,
    useGetDevicePinsApi,
    useUpdatePinsApi,
} from '@/hooks/apis/device.pin.hook';
import { useAppSelector } from '@/hooks/redux.hook';
import { selectDevices } from '@/redux/reducers/devices.reducer';
import { RESPONSE_STATUS } from '@/constants/api';
import PageTitle from '@/components/page-title/page-title';
import { useDispatch } from 'react-redux';
import {
    toasterActions,
    ToasterTypeEnum,
} from '@/redux/reducers/toaster.reducer';
import arduinoNano33Iot from '@/assets/images/arduino-nano-33-iot.svg';
import particleIoPhoton from '@/assets/images/particle-io-photon.jpeg';
import esp01s from '@/assets/images/esp-01s.svg';
import { selectUniversal } from '@/redux/reducers/universal.reducer';
import { PinItem } from '@/types/devices.type';
import { selectDevicePins } from '@/redux/reducers/pins.reducer';
import { DEVICE_MODE } from '@/constants/device-mode';
import closeIcon from '@/assets/images/dark-close.svg';

const DevicePinData = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { id: idFromUrl } = useParams();
    const id: number | null = idFromUrl ? Number(idFromUrl) : null;
    const isCreateMode = id === null;

    const devices = useAppSelector(selectDevices).devices;
    const device =
        (devices || []).filter((device) => device.id === Number(id))[0] || null;
    const devicePins = useAppSelector(selectDevicePins);

    const [name, setName] = useState(String);
    const [microcontrollerId, setMicrocontrollerId] = useState(Number);

    const [selectedPins, setSelectedPins] = useState(devicePins);
    const { microcontrollers } = useAppSelector(selectUniversal);
    const { deviceModes } = useAppSelector(selectUniversal);
    const [microcontrollerImg, setMicrocontrollerIdImg] = useState(String);
    const [isEditPinNameOpen, setIsEditPinNameOpen] = useState(Boolean);
    const inputPinNameRef = useRef<HTMLInputElement>(null);
    const [newPinName, setNewPinName] = useState(String);
    const [originalPin, setOriginalPin] = useState(String);

    const microcontrollerItem = (microcontrollers || []).filter((item) => {
        return item.id === microcontrollerId;
    });

    const [shouldBeAddedPins, setShouldBeAddedPins] = useState<
        PinItem[] | null
    >([]);

    const [shouldBeUpdatedPins, setShouldBeUpdatedPins] = useState<
        PinItem[] | null
    >([]);

    const [shouldBeDeletedPins, setShouldBeDeletedPins] = useState<
        PinItem[] | null
    >([]);

    const { isLoading: isGetting, fetchApi: getDeviceApi } = useGetDeviceApi(
        Number(id)
    );

    const { getDevicePinsApi } = useGetDevicePinsApi({
        id: Number(id),
    });

    const {
        isLoading: isUpdating,
        updateDeviceApi,
        data: updateDeviceResponse,
    } = useUpdateDeviceApi({
        id: Number(id),
        editedData: {
            name: name ? name : device?.name,
            microcontroller: microcontrollerId
                ? Number(microcontrollerId)
                : device?.microcontroller,
        },
    });

    const {
        fetchApi: createDeviceApi,
        isLoading: isCreating,
        data: createDeviceResponse,
    } = useCreateDeviceApi(name, microcontrollerId);

    const { data: createDevicePinResponse, fetchApi: createDevicePinsApi } =
        useCreatePinsApi(
            Number(createDeviceResponse?.id) || Number(id),
            shouldBeAddedPins || []
        );

    const { fetchApi: updateDevicePinsApi } = useUpdatePinsApi(
        Number(createDeviceResponse?.id) || Number(id),
        shouldBeUpdatedPins || []
    );

    const { fetchApi: deleteDevicePinsApi } = useDeletePinsApi(
        Number(createDeviceResponse?.id) || Number(id),
        shouldBeDeletedPins || []
    );

    const back = () => {
        if (isCreateMode) {
            navigate(`/dashboard/devices/`);
            return;
        }
        navigate(`/dashboard/devices/${id}`);
    };

    const editPinName = (name: string) => {
        setOriginalPin(name);
        setIsEditPinNameOpen(true);
        inputPinNameRef.current?.focus();
    };

    const closeEditPinName = () => {
        setIsEditPinNameOpen(false);
    };

    const updatePinName = () => {
        console.log(originalPin);
        console.log(newPinName);
        console.log(selectedPins);

        const pinData = selectedPins?.find((item) => {
            return item.pin === originalPin;
        });
        console.log(pinData);

        if (pinData) {
            console.log('AA');
            selectPins(pinData.pin, pinData.mode, newPinName, pinData.value);
        }

        setNewPinName('');
        console.log(originalPin);
        console.log(newPinName);
        setIsEditPinNameOpen(false);
    };

    const validate = () => {
        const validationMessage = [];
        if (name.length === 0) {
            validationMessage.push('請輸入裝置名稱');
        }
        if (selectedPins?.length === 0) {
            validationMessage.push('請至少選擇一個 PIN');
        }
        if (validationMessage.length > 0) {
            dispatch(
                toasterActions.pushOne({
                    message: validationMessage.join(', '),
                    duration: 5,
                    type: ToasterTypeEnum.WARN,
                })
            );
            return;
        }

        if (isCreateMode) {
            createDeviceApi();
        } else {
            updateDevice();
        }
    };

    const updateDevice = () => {
        const shouldBeUpdatedPins = selectedPins?.filter((item) =>
            devicePins?.map((devicePin) => devicePin.pin).includes(item.pin)
        );

        const shouldBeAddedPins = selectedPins?.filter(
            (item) =>
                !devicePins
                    ?.map((devicePin) => devicePin.pin)
                    .includes(item.pin)
        );

        const shouldBeDeletedPins = devicePins?.filter(
            (devicePin) =>
                !selectedPins
                    ?.map((selectedPin) => selectedPin.pin)
                    .includes(devicePin.pin)
        );

        if (shouldBeUpdatedPins && shouldBeUpdatedPins.length > 0) {
            setShouldBeUpdatedPins(shouldBeUpdatedPins);
        }

        if (shouldBeAddedPins && shouldBeAddedPins.length > 0) {
            setShouldBeAddedPins(shouldBeAddedPins);
        }

        if (shouldBeDeletedPins && shouldBeDeletedPins.length > 0) {
            setShouldBeDeletedPins(shouldBeDeletedPins);
        }

        updateDeviceApi();
    };

    const isSwitch = deviceModes.filter((item) => {
        return item.key === DEVICE_MODE.SWITCH;
    })[0]?.value;

    const isSensor = deviceModes.filter((item) => {
        return item.key === DEVICE_MODE.SENSOR;
    })[0]?.value;

    const selectPins = (
        pin: string,
        mode: number,
        name: string,
        value: number | null
    ) => {
        setSelectedPins(() => {
            const newSelected = [...(selectedPins || [])];
            const targetIndex = newSelected
                ?.map((item) => {
                    return item.pin;
                })
                .indexOf(pin);

            if (targetIndex !== -1) {
                newSelected?.splice(Number(targetIndex), 1);
            }

            const pushData: PinItem = {
                deviceId: Number(id),
                pin,
                mode,
                name,
                value,
            };

            newSelected.push({ ...pushData });
            console.log(newSelected);
            return newSelected;
        });
    };

    useEffect(() => {
        if (isCreateMode) {
            return;
        }
        getDeviceApi();
    }, []);

    useEffect(() => {
        if (device !== null) {
            setMicrocontrollerId(Number(device.microcontroller));
            setName(device.name);
            getDevicePinsApi();
        }
    }, [device]);

    useEffect(() => {
        setSelectedPins(devicePins);
    }, [devicePins]);

    useEffect(() => {
        // 切換裝置類型的時候 把選取的 PIN 都清空
        setSelectedPins([]);

        let targetKey = '';

        if (!microcontrollers || microcontrollers.length === 0) {
            return;
        }
        if (!isCreateMode && microcontrollerItem.length === 0) {
            return;
        }
        if (microcontrollerId === 0) {
            targetKey = microcontrollers[0].key;
            setMicrocontrollerId(microcontrollers[0].id);
        } else {
            targetKey = microcontrollerItem[0].key;
        }

        if (targetKey === 'PARTICLE_IO_PHOTON') {
            setMicrocontrollerIdImg(particleIoPhoton);
        } else if (targetKey === 'ARDUINO_NANO_IOT_33') {
            setMicrocontrollerIdImg(arduinoNano33Iot);
        } else if (targetKey === 'ESP_01S') {
            setMicrocontrollerIdImg(esp01s);
        }
    }, [microcontrollers, microcontrollerId]);

    useEffect(() => {
        if (updateDeviceResponse?.status === RESPONSE_STATUS.OK) {
            dispatch(
                toasterActions.pushOne({
                    message:
                        '裝置編輯已儲存，請重新下載程式碼並燒錄至裝置內以正常運作',
                    duration: 10,
                    type: ToasterTypeEnum.INFO,
                })
            );
            navigate(`/dashboard/devices/${id}`);
        }
    }, [updateDeviceResponse]);

    useEffect(() => {
        if (createDeviceResponse && !isNaN(createDeviceResponse.id)) {
            setShouldBeAddedPins(selectedPins);
            dispatch(
                toasterActions.pushOne({
                    message: '新增 Device 成功',
                    duration: 5,
                    type: ToasterTypeEnum.INFO,
                })
            );
            navigate(`/dashboard/devices/${createDeviceResponse.id}`);
        }
    }, [createDeviceResponse]);

    useEffect(() => {
        if (!shouldBeUpdatedPins || shouldBeUpdatedPins.length === 0) {
            return;
        }
        updateDevicePinsApi();
    }, [shouldBeUpdatedPins]);

    useEffect(() => {
        if (!shouldBeAddedPins || shouldBeAddedPins.length === 0) {
            return;
        }
        createDevicePinsApi();
    }, [shouldBeAddedPins]);

    useEffect(() => {
        if (!shouldBeDeletedPins || shouldBeDeletedPins.length === 0) {
            return;
        }
        deleteDevicePinsApi();
    }, [shouldBeDeletedPins]);

    useEffect(() => {
        if (createDevicePinResponse?.status === 'OK') {
            getDevicePinsApi();
        }
    }, [createDevicePinResponse]);

    const breadcrumbs = [
        {
            label: '裝置列表',
            pathName: '/dashboard/devices',
        },
        {
            label: isCreateMode ? '新增' : '編輯',
            pathName: useLocation().pathname,
        },
    ];

    return (
        <div className="device-pin-data" data-testid="device-pin-data">
            <PageTitle
                breadcrumbs={breadcrumbs}
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
                                    setMicrocontrollerId(Number(e.target.value))
                                }
                                className="form-select mt-2"
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
                            <div className="d-flex flex-wrap mt-5">
                                {microcontrollerItem[0]?.pins.map(
                                    (pin, index) => {
                                        return (
                                            <div
                                                className={`${
                                                    selectedPins
                                                        ?.map((pins) => {
                                                            return pins.pin;
                                                        })
                                                        .includes(pin.name)
                                                        ? 'selected'
                                                        : ''
                                                } position-relative pin p-2 m-1 mb-4`}
                                                role="button"
                                                key={index}
                                            >
                                                <div className="text-center pin-selector">
                                                    {selectedPins?.filter(
                                                        (pins) => {
                                                            return (
                                                                pins.pin ===
                                                                pin.name
                                                            );
                                                        }
                                                    )[0]?.mode === isSwitch ? (
                                                        <div>開關</div>
                                                    ) : (
                                                        <div>感應器</div>
                                                    )}
                                                </div>
                                                <div className="text-center rounded-circle bg-black bg-opacity-5 border-black border-opacity-10 pin-text">
                                                    {selectedPins?.find(
                                                        (pins) => {
                                                            return (
                                                                pins.pin ===
                                                                pin.name
                                                            );
                                                        }
                                                    )?.name || pin.name}
                                                </div>
                                                <div className="rounded-2 shadow-lg overflow-hidden bg-white pin-option">
                                                    <div
                                                        className={`lh-1 p-25`}
                                                        role="button"
                                                        onClick={() => {
                                                            selectPins(
                                                                pin.name,
                                                                isSwitch,
                                                                pin.name,
                                                                0
                                                            );
                                                        }}
                                                    >
                                                        設為開關
                                                    </div>
                                                    <div
                                                        className="lh-1 p-25"
                                                        role="button"
                                                        onClick={() => {
                                                            selectPins(
                                                                pin.name,
                                                                isSensor,
                                                                pin.name,
                                                                null
                                                            );
                                                        }}
                                                    >
                                                        設為感應器
                                                    </div>
                                                    <button
                                                        disabled={
                                                            selectedPins?.find(
                                                                (pins) => {
                                                                    return (
                                                                        pins.pin ===
                                                                        pin.name
                                                                    );
                                                                }
                                                            )
                                                                ? false
                                                                : true
                                                        }
                                                        className="border-0 btn text-black text-opacity-65 bg-transparent shadow-none p-25 rounded-0 fw-normal"
                                                        onClick={() => {
                                                            editPinName(
                                                                pin.name
                                                            );
                                                        }}
                                                    >
                                                        重新命名
                                                    </button>
                                                    <button
                                                        disabled={
                                                            selectedPins?.find(
                                                                (pins) => {
                                                                    return (
                                                                        pins.pin ===
                                                                        pin.name
                                                                    );
                                                                }
                                                            )
                                                                ? false
                                                                : true
                                                        }
                                                        className="border-0 btn text-black text-opacity-65 bg-transparent shadow-none p-25 rounded-0 fw-normal"
                                                        onClick={() => {
                                                            setSelectedPins(
                                                                selectedPins
                                                                    ? selectedPins.filter(
                                                                          (
                                                                              item
                                                                          ) =>
                                                                              item.pin !==
                                                                              pin.name
                                                                      )
                                                                    : []
                                                            );
                                                        }}
                                                    >
                                                        取消設定
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                        <div className="mb-4 text-center">
                            <img
                                className="w-100 microcontroller-img"
                                src={microcontrollerImg}
                                alt=""
                            />
                        </div>
                        <div className="d-flex justify-content-end mt-5">
                            <button
                                className="btn btn-secondary me-3"
                                onClick={back}
                            >
                                返回
                            </button>

                            <button
                                disabled={isCreating || isUpdating}
                                className="btn btn-primary"
                                onClick={validate}
                            >
                                {isCreateMode ? (
                                    <div>新增</div>
                                ) : (
                                    <div>儲存編輯</div>
                                )}
                            </button>
                        </div>
                    </div>
                    {/* 編輯 pin name */}
                    <div
                        className={`dialog position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center ${
                            isEditPinNameOpen ? '' : 'd-none'
                        }`}
                    >
                        <div
                            className="card py-3 px-0"
                            tabIndex={0}
                            onKeyUp={(
                                event: React.KeyboardEvent<HTMLDivElement>
                            ) => {
                                if (event.key === 'Escape') {
                                    close();
                                }
                            }}
                        >
                            <h4 className="text-center px-3 mb-0">重新命名</h4>
                            <hr />
                            <div className="px-3">
                                <input
                                    className="form-control"
                                    type="text"
                                    ref={inputPinNameRef}
                                    onKeyUp={(
                                        event: React.KeyboardEvent<HTMLInputElement>
                                    ) => {
                                        if (event.key === 'Escape') {
                                            close();
                                        }
                                        setNewPinName(
                                            event.currentTarget.value
                                        );

                                        if (event.key === 'Enter') {
                                            updatePinName();
                                        }
                                    }}
                                />
                            </div>
                            <hr />
                            <div className="d-flex align-items-center justify-content-end px-3">
                                <button
                                    className="btn btn-secondary me-3 btn-secondary"
                                    onClick={closeEditPinName}
                                >
                                    取消
                                </button>
                                <button
                                    className={`btn btn-primary`}
                                    onClick={updatePinName}
                                >
                                    確認
                                </button>
                            </div>
                            <div
                                role="button"
                                className="close-button position-absolute top-0 px-3 py-25"
                                onClick={closeEditPinName}
                            >
                                <img src={closeIcon} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevicePinData;
