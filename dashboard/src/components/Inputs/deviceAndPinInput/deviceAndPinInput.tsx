import { useState, useEffect } from 'react';
import { DeviceItem, PinItem } from '@/types/devices.type';
import AutocompletedSearch from '@/components/autocompletedSearch/autocompletedSearch';

const DeviceAndPinInputs = ({
    allDevices,
    initialDeviceName = '',
    deviceIdLable,
    deviceIdValue,
    deviceNameLabel,
    pinLabel,
    pinValue,
    pinOptions,
    updatePin,
    updateDeviceId,
}: {
    allDevices: DeviceItem[];
    initialDeviceName?: string;
    deviceIdLable: string;
    deviceIdValue: number;
    deviceNameLabel: string;
    pinLabel: string;
    pinValue: string;
    pinOptions: PinItem[];
    updatePin: (pin: string) => void;
    updateDeviceId: (id: number) => void;
}) => {
    const [deviceName, setDeviceName] = useState(initialDeviceName);

    const currentDeviceId =
        allDevices.filter(({ name }) => deviceName === name)[0]?.id || 0;

    useEffect(() => {
        updateDeviceId(currentDeviceId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentDeviceId]);

    return (
        <>
            <div className="form-group mt-3">
                <label>{deviceIdLable}</label>
                <input
                    className="form-control"
                    disabled
                    value={deviceIdValue}
                />
            </div>
            <div className="form-group mt-3">
                <label>{deviceNameLabel}</label>
                <AutocompletedSearch
                    currentValue={deviceName}
                    updateCurrentValue={(newValue) => setDeviceName(newValue)}
                    allSuggestions={allDevices.map(({ name }) => name)}
                />
            </div>
            <div className="form-group mt-3">
                <label>{pinLabel}</label>
                <select
                    value={pinValue}
                    onChange={(e) => {
                        const newSourcePin = e.target.value;
                        updatePin(newSourcePin);
                    }}
                >
                    {pinOptions.length > 0 ? (
                        <>
                            {pinValue === '' && <option>請選擇 Pin</option>}
                            {pinOptions.map(({ name, pin }, index) => {
                                return (
                                    <option
                                        key={`${name}-${index}`}
                                        value={pin}
                                    >
                                        {name}
                                    </option>
                                );
                            })}
                        </>
                    ) : (
                        <option>無任何 Pin 資料，請重新選擇裝置</option>
                    )}
                </select>
            </div>
        </>
    );
};

export default DeviceAndPinInputs;
