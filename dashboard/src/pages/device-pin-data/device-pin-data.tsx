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
import ReactTooltip from 'react-tooltip';

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

    const [name, setName] = useState('');
    const [microcontrollerId, setMicrocontrollerId] = useState(0);

    const [selectedPins, setSelectedPins] = useState(devicePins);
    const { microcontrollers } = useAppSelector(selectUniversal);
    const { deviceModes } = useAppSelector(selectUniversal);
    const [microcontrollerImg, setMicrocontrollerIdImg] = useState('');
    const [isEditPinNameOpen, setIsEditPinNameOpen] = useState(false);
    const pinNameInputRef = useRef<HTMLInputElement>(null);
    const [originalPin, setOriginalPin] = useState('');

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

    const { getDevicePinsApi, devicePins: devicePinData } = useGetDevicePinsApi(
        {
            id: Number(id),
        }
    );

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
    };

    const getShortPinName = (name: string) => {
        const pinName = selectedPins?.find((pins) => {
            return pins.pin === name;
        })?.name;

        if (!pinName) {
            return name;
        }
        if (pinName?.length <= 2) {
            return pinName;
        }
        return `${pinName.substring(0, 2)}...`;
    };

    const getFullPinName = (name: string) => {
        const newPinName = selectedPins?.find((pins) => {
            return pins.pin === name;
        })?.name;

        if (!newPinName) {
            return;
        }

        return newPinName;
    };

    const closeEditPinName = () => {
        setIsEditPinNameOpen(false);
    };

    const updatePinName = () => {
        const pinData = selectedPins?.find((item) => {
            return item.pin === originalPin;
        });

        if (!pinData) {
            return;
        }

        if (pinNameInputRef.current) {
            selectPins(
                pinData.pin,
                pinData.mode,
                pinNameInputRef.current.value,
                pinData.value
            );
            pinNameInputRef.current.value = '';
        }

        setIsEditPinNameOpen(false);
        ReactTooltip.rebuild();
    };
    const [isValidData, setIsValidData] = useState({
        name: true,
        selectedPins: true,
    });

    const validate = () => {
        let isValidAll = true;
        if (!name) {
            setIsValidData((prev) => {
                return {
                    ...prev,
                    name: false,
                };
            });
            isValidAll = false;
        }
        if (!selectedPins || selectedPins.length === 0) {
            setIsValidData((prev) => {
                return {
                    ...prev,
                    selectedPins: false,
                };
            });
            isValidAll = false;
        }

        if (isValidAll) {
            isCreateMode ? createDeviceApi() : updateDevice();
            return;
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
            return newSelected;
        });
        setIsValidData((prev) => {
            return {
                ...prev,
                selectedPins: true,
            };
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
        ReactTooltip.rebuild();
    }, [selectedPins]);

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
            console.log(arduinoNano33Iot);
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

    useEffect(() => {
        pinNameInputRef.current?.focus();
    }, [isEditPinNameOpen]);

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
                    <div>
                        <div className="mb-4">
                            <label>裝置名稱</label>
                            <input
                                type="text"
                                className={`form-control mt-2 ${
                                    !isValidData.name && 'border-danger'
                                }`}
                                placeholder="請輸入裝置名稱"
                                defaultValue={device ? device.name : ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setName(e.target.value);
                                    setIsValidData((prev) => {
                                        return {
                                            ...prev,
                                            name: value ? true : false,
                                        };
                                    });
                                }}
                            />
                            {!isValidData.name && (
                                <div className="text-danger mt-1 fs-5">
                                    請輸入裝置名稱
                                </div>
                            )}
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
                            {!isValidData.selectedPins && (
                                <div className="text-danger fs-5">
                                    請點選並設定至少一個 Pin
                                </div>
                            )}
                            <div className="d-flex flex-wrap mt-2">
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
                                                <div
                                                    className="text-center rounded-circle bg-black bg-opacity-5 border-black border-opacity-10 pin-text"
                                                    data-tip={getFullPinName(
                                                        pin.name
                                                    )}
                                                >
                                                    {getShortPinName(pin.name)}
                                                </div>
                                                <ReactTooltip
                                                    effect="solid"
                                                    place="bottom"
                                                />
                                                <div
                                                    className={`rounded-2 shadow-lg overflow-hidden bg-white pin-option ${
                                                        selectedPins?.find(
                                                            (pins) => {
                                                                return (
                                                                    pins.pin ===
                                                                    pin.name
                                                                );
                                                            }
                                                        )
                                                            ? 'pin-option-4'
                                                            : 'pin-option-2'
                                                    }`}
                                                >
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
                                                    <div
                                                        className={`lh-1 p-25 ${
                                                            selectedPins?.find(
                                                                (pins) => {
                                                                    return (
                                                                        pins.pin ===
                                                                        pin.name
                                                                    );
                                                                }
                                                            )
                                                                ? ''
                                                                : 'd-none'
                                                        }`}
                                                        onClick={() => {
                                                            editPinName(
                                                                pin.name
                                                            );
                                                        }}
                                                    >
                                                        重新命名
                                                    </div>
                                                    <div
                                                        className={`lh-1 p-25 ${
                                                            selectedPins?.find(
                                                                (pins) => {
                                                                    return (
                                                                        pins.pin ===
                                                                        pin.name
                                                                    );
                                                                }
                                                            )
                                                                ? ''
                                                                : 'd-none'
                                                        }`}
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
                                                    </div>
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
                            onKeyUp={(
                                event: React.KeyboardEvent<HTMLDivElement>
                            ) => {
                                if (event.key === 'Escape') {
                                    closeEditPinName();
                                }
                            }}
                        >
                            <h4 className="text-center px-3 mb-0">重新命名</h4>
                            <hr />
                            <div className="px-3">
                                <input
                                    placeholder="請輸入 PIN 的名稱"
                                    className="form-control"
                                    type="text"
                                    ref={pinNameInputRef}
                                    onKeyUp={(
                                        event: React.KeyboardEvent<HTMLInputElement>
                                    ) => {
                                        if (event.key === 'Escape') {
                                            closeEditPinName();
                                        }

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
