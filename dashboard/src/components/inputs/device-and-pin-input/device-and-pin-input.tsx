import { useState, useEffect } from 'react';
import { DeviceItem, PinItem } from '@/types/devices.type';
import AutocompletedSearch from '@/components/inputs/autocompleted-search/autocompleted-search';

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
        <div className="d-flex flex-column flex-md-row w-100 mb-3">
            <div className="form-group w-100 pe-md-3 mb-3 mb-md-0">
                <label className="mb-1">{deviceNameLabel}</label>
                <AutocompletedSearch
                    placeholder="請輸入裝置名稱搜尋"
                    currentValue={deviceName}
                    updateCurrentValue={(newValue) => setDeviceName(newValue)}
                    allSuggestions={allDevices.map(({ name }) => name)}
                />
            </div>
            <div className="form-group w-100 ps-md-3">
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
                            {pinValue === '' && (
                                <option key="not-yet-choose" value="">
                                    請選擇 PIN
                                </option>
                            )}
                            {pinOptions.map(({ name, pin }, index) => {
                                return (
                                    <option
                                        key={`${name}-${index}`}
                                        value={pin}
                                    >
                                        {name || 'PIN'}
                                    </option>
                                );
                            })}
                        </>
                    ) : (
                        <option>此裝置目前無 Pins，請重新選擇裝置</option>
                    )}
                </select>
            </div>
        </div>
    );
};

export default DeviceAndPinInputs;
