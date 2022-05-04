import { useState, useEffect } from 'react';
import { DeviceItem, PinItem } from '@/types/devices.type';
import AutocompletedSearch from '@/components/autocompleted-search/autocompleted-search';

const DeviceAndPinInputs = ({
    allDevices,
    initialDeviceName = '',
    deviceNameLabel,
    pinLabel,
    pinValue,
    pinOptions,
    updatePin,
    updateDeviceId,
}: {
    allDevices: DeviceItem[];
    initialDeviceName?: string;
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
        <div className="d-flex f-wrap w-100 mb-3">
            <div className="form-group w-50 pe-3">
                <label className="mb-1">{deviceNameLabel}</label>
                <AutocompletedSearch
                    currentValue={deviceName}
                    updateCurrentValue={(newValue) => setDeviceName(newValue)}
                    allSuggestions={allDevices.map(({ name }) => name)}
                />
            </div>
            <div className="form-group w-50 ps-3">
                <label className="mb-1">{pinLabel}</label>
                <select
                    className="form-select"
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
        </div>
    );
};

export default DeviceAndPinInputs;
