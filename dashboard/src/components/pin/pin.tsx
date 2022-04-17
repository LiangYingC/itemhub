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
    const isNameChangedRef = useRef(false);
    const isSwitch = mode === 1;

    const { isLoading: isChanging, updateDeviceSwitchPinApi } =
        useUpdateDeviceSwitchPinApi({
            deviceId,
            pin,
            value,
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
        if (value && !isSwitch) {
            return;
        }
        updateDeviceSwitchPinApi();
    }, [value, isSwitch]);

    return (
        <div
            className="pin d-flex flex-wrap align-items-center mb-2"
            role={isSwitch ? 'button' : ''}
            onClick={isSwitch ? toggleSwitch : () => {}}
        >
            <div className="name me-2">
                {isEditMode ? (
                    <div>
                        <input
                            className="form-control me-2"
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
                    <div className="me-2"> {name || pin}</div>
                )}
            </div>

            {isSwitch ? (
                <div className="state d-flex align-items-center">
                    <div
                        className={`${
                            value === 1
                                ? 'bg-green active'
                                : 'bg-black bg-opacity-25'
                        } d-flex align-items-center toggle-button d-flex rounded-pill`}
                    >
                        <div className="button-head bg-white rounded-circle" />
                    </div>
                </div>
            ) : (
                <>
                    <div>: {value}</div>
                    <div className="h6 mb-0 text-black-opacity-45 w-100">
                        最後回傳時間:
                        {` ${moment(createdAt).format('YYYY-MM-DD HH:mm')}`}
                    </div>
                </>
            )}
        </div>
    );
};

export default Pin;
