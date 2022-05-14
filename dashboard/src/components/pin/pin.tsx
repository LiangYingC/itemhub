import { useUpdateDeviceSwitchPinApi } from '@/hooks/apis/devices.hook';
import { useEffect, useState, useRef } from 'react';
import { useUpdateDevicePinNameApi } from '@/hooks/apis/devices.hook';
import { useDebounce } from '@/hooks/debounce.hook';
import { PinItem } from '@/types/devices.type';
import moment from 'moment';

const Pin = (props: { pinItem: PinItem; isEditMode: boolean }) => {
    const { isEditMode, pinItem } = props;
    const {
        deviceId,
        pin,
        createdAt,
        mode,
        value: valueFromPorps,
        name: nameFromProps,
    } = pinItem;
    const [value, setValue] = useState(valueFromPorps);
    const [name, setName] = useState(nameFromProps);
    const [isInitialized, setIsInitialized] = useState(false);
    const isNameChangedRef = useRef(false);
    const isSwitch = mode === 1;

    const { isLoading: isChanging, updateDeviceSwitchPinApi } =
        useUpdateDeviceSwitchPinApi({
            deviceId,
            pin,
            value: value || 0,
        });

    const { updateDevicePinNameApi, isLoading: isNameUpdating } =
        useUpdateDevicePinNameApi({
            deviceId,
            pin,
            name,
            callbackFunc: () => {
                isNameChangedRef.current = false;
            },
        });
    const debounceUpdatePinName = useDebounce(updateDevicePinNameApi, 800);

    const toggleSwitch = () => {
        setValue(value === 1 ? 0 : 1);
    };

    const updateLocalPinName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        isNameChangedRef.current = true;
        debounceUpdatePinName();
    };

    useEffect(() => {
        if (!isInitialized || value === undefined || !isSwitch) {
            return;
        }
        updateDeviceSwitchPinApi();
    }, [value, isSwitch]);

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    return (
        <div
            className="pin d-flex flex-wrap align-items-center mb-2"
            role={isSwitch ? 'button' : ''}
            onClick={isSwitch ? toggleSwitch : () => {}}
        >
            <div className="name">
                {isEditMode ? (
                    <div>
                        <input
                            className="form-control"
                            title={pin}
                            placeholder={pin}
                            value={name || ''}
                            onChange={updateLocalPinName}
                        />
                        <div>
                            {isNameChangedRef.current
                                ? '名稱有異動'
                                : isNameUpdating
                                ? '更新中'
                                : ''}
                        </div>
                    </div>
                ) : (
                    <div className="text-black text-opacity-65 me-2 mb-2">
                        {' '}
                        {name || pin}
                    </div>
                )}
            </div>

            {isSwitch ? (
                <div className="state d-flex align-items-center ms-2">
                    <div
                        className={`${
                            value === 1
                                ? 'bg-green active'
                                : 'bg-black bg-opacity-25'
                        } d-flex align-items-center toggle-button d-flex rounded-pill mb-2`}
                    >
                        <div className="button-head bg-white rounded-circle" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="text-black text-opacity-65 mb-2">
                        : {value}
                    </div>
                    <div className="fs-5 mb-0 text-black text-opacity-45 fw-normal w-100">
                        最後回傳時間
                        {` ${moment(createdAt).format('YYYY-MM-DD HH:mm')}`}
                    </div>
                </>
            )}
        </div>
    );
};

export default Pin;
